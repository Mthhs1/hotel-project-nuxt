<script setup lang="ts">
import ExtractNewReservation from "~/components/dashboard/reservation/new/extractNewReservation.vue"
import NewReservationForm from "~/components/dashboard/reservation/new/newReservationForm.vue"
import { type AdicionalItem } from "~/lib/db/schemas"
import type { Quarto } from "~/lib/db/schemas"
import * as z from "zod"

const route = useRoute()

const schema = z.object({
    hours: z.string().min(1, "Selecione a duração da estadia."),
    guests: z.number().min(1, "Selecione o número de hóspedes."),
    isGarageSelected: z.boolean(),
    numberGarage: z.number(),
    additionals: z.array(z.string()),
})

type Schema = z.infer<typeof schema>

const formOptions = reactive<Schema>({
    hours: "",
    guests: 0,
    isGarageSelected: false,
    numberGarage: 0,
    additionals: [],
})

//declaracao do quarto e adicionais
const room = ref<Quarto | undefined>(undefined)
const additionals = ref<AdicionalItem[] | undefined>(undefined)

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
const mapAdditionals = reactive<Record<string, AdicionalItem>>({})
additionals.value?.forEach((additional) => {
    mapAdditionals[additional.name] = additional
})

interface MapHoursToPrice {
    [key: string]: number
}

const mapHoursToPrice = reactive<MapHoursToPrice>({
    "2 horas": (room?.value?.basePrice ?? 0) * 1,
    "4 horas": (room?.value?.basePrice ?? 0) * 2,
    "6 horas": (room?.value?.basePrice ?? 0) * 3,
    "8 horas": (room?.value?.basePrice ?? 0) * 4,
})

const totalGarage = computed(() => {
    if (formOptions.isGarageSelected) {
        return (
            formOptions.numberGarage *
            (mapAdditionals["Garagem"]?.basePrice ?? 0)
        )
    }
    return 0
})

const totalHours = computed(() => {
    return mapHoursToPrice[formOptions.hours] || 0
})

const totalAdditionals = computed(() => {
    let total = 0
    if (formOptions.additionals.length > 0) {
        formOptions.additionals.forEach((additional) => {
            total += mapAdditionals[additional]?.basePrice ?? 0
        })
    }
    return total
})

const totalGuestExceedBaseCapacity = computed(() => {
    if (room.value) {
        const excessGuests = formOptions.guests - room.value.baseCapacity
        if (excessGuests > 0) {
            return excessGuests * (room.value.extraPersonPrice ?? 0)
        }
    }
    return 0
})

//criacao da variavel total
const total = computed((): number => {
    let total = 0

    if (room.value && additionals.value) {
        total =
            totalGarage.value +
            totalHours.value +
            totalGuestExceedBaseCapacity.value +
            totalAdditionals.value
    }

    return total
})

// funcao que lida com as mudancas no extrato
function handleExtractChange(payload: Schema): void {
    Object.assign(formOptions, payload)
    console.log(formOptions)
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
            <div class="flex flex-col justify-center">
                <img
                    :src="`${room?.url}1.jpg`"
                    class="rounded"
                    alt="Foto do seu quarto escolhido"
                />

                <h2 class="text-2xl text-gray-700 bg-gray-200 font-extralight mt-4 rounded-md w-full text-center shadow-sm/10">
                    {{ room?.roomType }} - R$ {{ room?.basePrice.toFixed(2) }}
                </h2>
            </div>
            <ExtractNewReservation
                :isGarageSelected="formOptions.isGarageSelected"
                :numberGarage="formOptions.numberGarage"
                :guests="formOptions.guests"
                :hours="formOptions.hours"
                :hours-price="totalHours"
                :additionals="formOptions.additionals"
                :additionalsPrice="mapAdditionals"
                :room="room"
            />
            <div>
                <p class="text-3xl font-extralight">
                    Total: R$ {{ total?.toFixed(2) }}
                </p>
            </div>
        </div>
    </div>
</template>
