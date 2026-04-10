<script setup lang="ts">
import ExtractNewReservation from "~/components/dashboard/reservation/new/extractNewReservation.vue"
import Form from "~/components/dashboard/reservation/new/Form.vue"
import NewReservationRoomCard from "~/components/dashboard/reservation/new/newReservationRoomCard.vue"
import { type AdicionalItem } from "~/lib/db/schemas"
import type { Quarto } from "~/lib/db/schemas"
import * as z from "zod"

import { DEFAULT_STAY_TIME_MULTIPLIER } from "~/../shared/const/stayTime"
import { type StayTimeOption } from "~/../shared/types/stayTime"
import extractCalculate from "~/../shared/helpers/extractCalculate"

const route = useRoute()

// Schema de validação do formulário (vindo do componente filho)
const schema = z.object({
    hours: z.string().min(1, "Selecione a duração da estadia."),
    guests: z.number().min(1, "Selecione o número de hóspedes."),
    booleanAdditionals: z.array(z.string()),
    quantityAdditionals: z.record(
        z.string(),
        z.object({
            isMarked: z.boolean(),
            quantity: z.number(),
        }),
    ),
})
type FormSchema = z.infer<typeof schema>

// Estado reativo para os dados do formulário com os valores iniciais
const formInfoRetrieved = reactive<FormSchema>({
    hours: "",
    guests: 0,
    booleanAdditionals: [],
    quantityAdditionals: {},
})

// Declaração das variáveis reativas para os dados da reserva/quarto e adicionais
const room = ref<Quarto | undefined>(undefined)
const additionalsDB = ref<AdicionalItem[] | undefined>(undefined)

// fetch dos dados do quarto selecionado e dos adicionais disponíveis para reserva feito no SSR para garantir que os dados estejam disponíveis ao carregar a página, evitando problemas de renderização ou falta de dados nos componentes filhos
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

// Atribuição dos dados obtidos do fetch às variáveis reativas para uso nos componentes filhos e na lógica de cálculo dos valores da reserva
room.value = response.data.value?.room
additionalsDB.value = response.data.value?.additionals

// Mapeamento dos adicionais para um formato mais acessível, facilitando a consulta dos preços e detalhes dos adicionais durante o processo de reserva
// Está na forma {adicionalItemId: AdicionalItem}, permitindo acessar diretamente os detalhes de um adicional pelo seu ID
const mapAdditionals = reactive<Record<string, AdicionalItem>>({})
additionalsDB.value?.forEach((additional) => {
    mapAdditionals[String(additional.id)] = additional
})

// Mapeamento das horas para os preços correspondentes, baseado no preço base do quarto, facilitando o cálculo do valor total da reserva com base na duração da estadia selecionada
const mapHoursToPrice = reactive<Record<StayTimeOption, number>>({
    "2 horas":
        (room?.value?.basePrice ?? 0) * DEFAULT_STAY_TIME_MULTIPLIER["2 horas"],
    "4 horas":
        (room?.value?.basePrice ?? 0) * DEFAULT_STAY_TIME_MULTIPLIER["4 horas"],
    "6 horas":
        (room?.value?.basePrice ?? 0) * DEFAULT_STAY_TIME_MULTIPLIER["6 horas"],
    "8 horas":
        (room?.value?.basePrice ?? 0) * DEFAULT_STAY_TIME_MULTIPLIER["8 horas"],
    "Per noite":
        (room?.value?.basePrice ?? 0) *
        DEFAULT_STAY_TIME_MULTIPLIER["Per noite"],
})

const prices = reactive({
    guestsPrice: 0,
    hoursPrice: 0,
    totalAdditionalsPrice: 0,
    booleanAdditionalsPrice: {} as Record<string, number>,
    quantityAdditionalsPrice: {} as Record<
        string,
        { price: number; quantity: number }
    >,
    totalPrice: 0,
})

// Função para lidar com as mudanças nos dados do formulário, recebendo os dados atualizados do componente filho e atualizando o estado reativo do formulário,
// permitindo que os cálculos e a exibição dos valores sejam atualizados em tempo real conforme o usuário faz suas seleções
function handleExtractChange(payload: FormSchema): void {
    Object.assign(formInfoRetrieved, payload)
    const {
        guestsPrice,
        hoursPrice,
        totalAdditionalsPrice,
        totalPrice,
        booleanAdditionalsPrice,
        quantityAdditionalsPrice,
    } = extractCalculate(room.value!, mapAdditionals, formInfoRetrieved)

    Object.assign(prices, {
        guestsPrice,
        hoursPrice,
        totalAdditionalsPrice,
        totalPrice,
        booleanAdditionalsPrice,
        quantityAdditionalsPrice,
    })

    console.log(prices)
}
</script>

<template>
    <div
        class="min-h-full bg-[radial-gradient(circle_at_top,#e4eef6_0%,#f7f5ef_38%,#f8fafc_100%)] rounded-xl"
    >
        <UContainer class="py-6 sm:py-8">
            <div class="space-y-6">
                <!-- Cartão de visualização do quarto -->
                <NewReservationRoomCard :room="room" />

                <!-- Criação da reserva -->
                <div class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_400px]">
                    <!-- Formulário de criação da reserva -->
                    <Form
                        :additionals="additionalsDB"
                        :room="room"
                        @extract-change="handleExtractChange"
                    />

                    <!-- Extrato da reserva. -->
                    <div class="xl:sticky xl:top-6 xl:self-start">
                        <ExtractNewReservation
                            :mapAdditionals="mapAdditionals!"
                            :prices="prices"
                            :guests="formInfoRetrieved.guests"
                            :hours="formInfoRetrieved.hours"
                            :room="room!"
                        />
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>
