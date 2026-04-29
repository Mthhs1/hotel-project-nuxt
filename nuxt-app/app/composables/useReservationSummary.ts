import { type ReservationFormSchemaBase } from "~/utils/schemas/newReservationSchema"
import type {
    Quarto,
    AdicionalItem,
    AdicionalConsumido,
} from "~/lib/db/schemas/index"

import extractCalculate from "~~/shared/helpers/extractCalculate"

export async function useReservationSummary(
    asyncKey: string,
    identifier: number,
    fetchRoom: (identifier: number) => Promise<
        | {
              room: Quarto | undefined
              initialState: {
                  hours: number
                  guests: number
                  additionalsConsumed: AdicionalConsumido[]
              } | null
          }
        | undefined
    >,
) {
    // Estado reativo para os dados do formulário com os valores iniciais
    const formInfoRetrieved = reactive<ReservationFormSchemaBase>({
        hours: 0,
        guests: 0,
        booleanAdditionals: [],
        quantityAdditionals: {},
    })

    // fetch dos dados do quarto selecionado e dos adicionais disponíveis para reserva feito no SSR para garantir que os dados estejam disponíveis ao carregar a página, evitando problemas de renderização ou falta de dados nos componentes filhos
    const response = await useAsyncData(asyncKey, async () => {
        if (!identifier) {
            navigateTo("/")
        }

        const response = await fetchRoom(identifier)

        const responseAdditionals = await $fetch("/api/additionals/all", {
            method: "GET",
        })

        return {
            room: response?.room,
            additionals: responseAdditionals,
            initialState: response?.initialState,
        }
    })

    // Atribuição dos dados obtidos do fetch às variáveis reativas para uso nos componentes filhos e na lógica de cálculo dos valores da reserva
    const room = computed(() => response.data.value?.room)
    const additionalsDB = computed(() => {
        const map: Record<string, AdicionalItem> = {}

        response.data.value?.additionals?.forEach((additional) => {
            map[String(additional.id)] = additional
        })
        return map
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
        } = extractCalculate(room.value!, additionalsDB.value, formInfoRetrieved)

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
        prices,
        formInfoRetrieved,
        initialState: response.data.value?.initialState || null,
        handleExtractChange,
    }
}
