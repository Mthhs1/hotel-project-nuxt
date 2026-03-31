<script setup lang="ts">
import ExtractNewReservation from "~/components/dashboard/reservation/new/extractNewReservation.vue"
import NewReservationForm from "~/components/dashboard/reservation/new/newReservationForm.vue"
import { type AdicionalItem } from "~/lib/db/schemas"
import type { Quarto } from "~/lib/db/schemas"

const route = useRoute()

//declaracao do quarto e adicionais
const room = ref<Quarto | undefined>(undefined)
const additionals = ref<AdicionalItem[] | undefined>(undefined)

//declaracao do tipo extrato, interessante depois inserir na pasta libs/types
interface ExtractOptions {
    garage: [boolean, number]
    guests: number
    hours: string
    additionals: string[]
}

//inicializacao do extrato com os valores zerados/falsos
const extractOptions = ref<ExtractOptions>({
    garage: [false, 0],
    guests: 1,
    hours: "",
    additionals: [],
})

//fetch dos dados do quarto selecionado e dos adicionais disponiveis. SSR para garantir que os dados sejam carregados antes do componente ser renderizado
const response = await useAsyncData(
    "get-selected-room-new-reservation",
    async () => {
        const query = route.query
        if (!Object.keys(query).length) {
            navigateTo("/")
        }

        const responseRooms = await $fetch("/api/rooms/some", {
            method: "GET",
            query: {
                by: "id",
                identifier: Number(query.id),
            },
        })

        const responseAdditionals = await $fetch("/api/additionals/all", {
            method: "GET",
        })

        return { room: responseRooms, additionals: responseAdditionals }
    },
)
room.value = response.data.value?.room
additionals.value = response.data.value?.additionals

//criacao de um objeto para mapear os adicionais pelo nome, facilitando o acesso ao preço dos adicionais selecionados no extrato
const prices = reactive<Record<string, AdicionalItem>>({})
additionals.value?.forEach((additional) => {
    prices[additional.name] = additional
})

interface MapHoursToPrice {
    [key: string]: number
}

const mapHoursToPrice: MapHoursToPrice = {
    "2 horas": (room?.value?.basePrice ?? 0) * 1,
    "4 horas": (room?.value?.basePrice ?? 0) * 2,
    "6 horas": (room?.value?.basePrice ?? 0) * 3,
    "8 horas": (room?.value?.basePrice ?? 0) * 4,
}

//criacao da variavel total
const total = computed(
    ():
        | {
              total: number
              totalGarage: number
              totalHours: number
              totalAdditionals: number
          }
        | undefined => {
        let total = 0
        let guestsExceedBaseCapacity = 0
        let totalAdditionals = 0

        let totalGarage =
            extractOptions.value.garage[1] * (prices["Garagem"]?.basePrice ?? 0)

        let totalHours = mapHoursToPrice[extractOptions.value.hours] || 0

        if (extractOptions.value.additionals.length > 0) {
            extractOptions.value.additionals.forEach((additional) => {
                totalAdditionals += prices[additional]?.basePrice ?? 0
            })
        }

        if (
            extractOptions.value.guests - (room.value?.baseCapacity ?? 0) > 0 &&
            room.value?.extraPersonPrice
        ) {
            guestsExceedBaseCapacity =
                (extractOptions.value.guests -
                    (room.value?.baseCapacity ?? 0)) *
                room.value?.extraPersonPrice
        }

        if (room.value && additionals.value) {
            total =
                totalGarage +
                totalHours +
                guestsExceedBaseCapacity +
                totalAdditionals
        }

        return { total, totalGarage, totalHours, totalAdditionals }
    },
)

// funcao que lida com as mudancas no extrato
function handleExtractChange(payload: ExtractOptions): void {
    extractOptions.value = payload
}
</script>

<template>
    <div class="flex gap-4 p-4 relative items-stretch h-full">
        <div class="flex-3/6">
            <NewReservationForm
                :additionals="additionals"
                :room="room"
                class="flex-1/6"
                @extract-change="handleExtractChange"
            />
        </div>
        <USeparator color="neutral" orientation="vertical" />
        <div class="flex-2/6 flex flex-col justify-between relative">
            <img
                :src="`${room?.url}1.jpg`"
                class="rounded"
                alt="Foto do seu quarto escolhido"
            />
            <ExtractNewReservation
                :isGarageSelected="extractOptions.garage[0]"
                :numberGarage="extractOptions.garage[1]"
                :guests="extractOptions.guests"
                :hours="extractOptions.hours"
                :hours-price="total?.totalHours"
                :additionals="extractOptions.additionals"
                :additionalsPrice="prices"
                :room="room"
            />
            <div>
                <p class="text-3xl font-extralight">Total: R$ {{ total?.total.toFixed(2) }}</p>
            </div>
        </div>
    </div>
</template>
