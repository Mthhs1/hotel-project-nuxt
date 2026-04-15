import { type ReservationFormSchemaBase } from "~/utils/schemas/newReservationSchema"
import type { Quarto, AdicionalItem } from "~/lib/db/schemas/index"

import extractCalculate from "~~/shared/helpers/extractCalculate"

export async function useReservationSummary(asyncKey: string) {
    const route = useRoute()

    // Estado reativo para os dados do formulário com os valores iniciais
    const formInfoRetrieved = reactive<ReservationFormSchemaBase>({
        hours: "",
        guests: 0,
        booleanAdditionals: [],
        quantityAdditionals: {},
    })

    // Declaração das variáveis reativas para os dados da reserva/quarto e adicionais
    const room = ref<Quarto | undefined>(undefined)
    const additionalsDB = ref<AdicionalItem[] | undefined>(undefined)

    // fetch dos dados do quarto selecionado e dos adicionais disponíveis para reserva feito no SSR para garantir que os dados estejam disponíveis ao carregar a página, evitando problemas de renderização ou falta de dados nos componentes filhos
    const response = await useAsyncData(asyncKey, async () => {
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
    })

    // Atribuição dos dados obtidos do fetch às variáveis reativas para uso nos componentes filhos e na lógica de cálculo dos valores da reserva
    room.value = response.data.value?.room
    additionalsDB.value = response.data.value?.additionals

    // Mapeamento dos adicionais para um formato mais acessível, facilitando a consulta dos preços e detalhes dos adicionais durante o processo de reserva
    // Está na forma {adicionalItemId: AdicionalItem}, permitindo acessar diretamente os detalhes de um adicional pelo seu ID
    const mapAdditionals = reactive<Record<string, AdicionalItem>>({})
    additionalsDB.value?.forEach((additional) => {
        mapAdditionals[String(additional.id)] = additional
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
    function handleExtractChange(payload: ReservationFormSchemaBase): void {
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
    }

    return {
        room,
        additionalsDB,
        handleExtractChange,
        mapAdditionals,
        prices,
        formInfoRetrieved,
    }
}
