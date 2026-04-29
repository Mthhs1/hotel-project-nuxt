import { ref, watch } from "vue"
import {
    type AdicionalConsumido,
    type AdicionalItem,
    type Quarto,
} from "~/lib/db/schemas/index"
import {
    STAY_TIME_OPTIONS,
    STAY_TIME_TO_HOURS,
} from "../../shared/const/stayTime"
import { type ReservationFormSchema } from "~/utils/schemas/newReservationSchema"
import type { CheckboxGroupItem, FormSubmitEvent, SelectItem } from "@nuxt/ui"
import { FetchError } from "ofetch"

// Declarando as props (argumentos) que serão recebidas pelo composable
type props = {
    room: Ref<Quarto | undefined>
    additionals: Ref<Record<string, AdicionalItem>>
    initialState: Ref<{
        hours: number
        guests: number
        additionalsConsumed: AdicionalConsumido[]
    } | null>
}

export function useReservationForm(props: props) {
    const toast = useToast()

    // Criando os itens para o select de horas, mapeando as opções de tempo de estadia para o formato esperado pelo componente Select
    // { label: string, value: number }
    const hourItems = ref<SelectItem[]>(
        STAY_TIME_OPTIONS.map((option) => ({
            label: option,
            value: STAY_TIME_TO_HOURS[option],
        })),
    )

    // filtrando os adicionais de seleção (booleanos)
    // {id: adicional}
    const booleanAdditionals = computed(() => {
        const filtered = Object.entries(props.additionals.value).filter(
            ([_, additional]) => {
                return additional.selectionType === "boolean"
            },
        )

        return Object.fromEntries(filtered)
    })

    // filtrando os adicionais de quantidade
    // {id: adicional}
    const quantityAdditionals = computed(() => {
        const filtered = Object.entries(props.additionals.value).filter(
            ([_, additional]) => {
                return additional.selectionType === "quantity"
            },
        )

        return Object.fromEntries(filtered)
    })

    // declarando o estado dos adicionais de quantidade
    const quantityAdditionalsInitialState: Record<
        string,
        { isMarked: boolean; quantity: number }
    > = {}

    // iterando sobre os adicionais existentes para forma o estado dos adicionais de quantidade
    // {id: {isMarked, quantity}}
    Object.entries(props.additionals.value).forEach(([id, additional]) => {
        if (additional.selectionType === "quantity") {
            quantityAdditionalsInitialState[id] = {
                isMarked: false,
                quantity: 0,
            }
        }
    })

    // declarando o estado do formulario de reserva, que inclui as horas, hóspedes, 
    // adicionais de seleção (booleanos) e adicionais de quantidade
    const state = reactive<ReservationFormSchema>({
        hours: 0,
        guests: 1,
        booleanAdditionals: [],
        // Assumimos que os adicionais já chegam prontos e não mudam
        // durante o ciclo de vida deste formulário.
        quantityAdditionals: quantityAdditionalsInitialState,
    })

    // Se houver um estado inicial (reserva já existente), preenchemos o estado do 
    // formulário com os dados da reserva, mapeando os adicionais consumidos para os formatos esperados pelos campos booleanAdditionals e quantityAdditionals
    if (props.initialState.value) {
        props.initialState.value.additionalsConsumed.forEach((consumed) => {
            const additional = props.additionals.value[consumed.adicionalItemId]

            if (additional?.selectionType === "boolean") {
                state.booleanAdditionals.push(String(additional.id))
            }

            if (additional?.selectionType === "quantity") {
                state.quantityAdditionals[String(additional.id)] = {
                    isMarked: consumed.quantity > 0,
                    quantity: consumed.quantity,
                }
            }
        })

        state.hours = props.initialState.value.hours
        state.guests = props.initialState.value.guests
    }

    // Criando os itens para o checkbox group dos adicionais de seleção (booleanos), 
    // mapeando os adicionais filtrados para o formato esperado pelo componente CheckboxGroup
    // { label: string, description: string, value: string }
    const itemsCheckBoxGroupBoolean = computed<CheckboxGroupItem[]>(() => {
        return Object.entries(booleanAdditionals.value)
            .filter(([_, additional]) => {
                return additional.isOptional
            })
            .map(([id, additional]) => ({
                label: additional.name,
                description: additional.description,
                value: id,
            }))
    })

    //watcher o qual é responsavel de observar as mudanças no estado dos adicionais de quantidade, 
    // e caso um adicional seja desmarcado (isMarked: false) ele zera a quantidade desse adicional para 0, 
    // garantindo que não haja inconsistências entre o estado de marcação e a quantidade dos adicionais de quantidade
    watch(
        () => state.quantityAdditionals,
        (quantityAdditionals) => {
            for (const additional of Object.values(quantityAdditionals)) {
                if (!additional.isMarked && additional.quantity !== 0) {
                    additional.quantity = 0
                }
            }
        },
        { deep: true },
    )

    // Criando os badges de resumo da reserva, que exibem informações como tarifa base, capacidade e quantidade de adicionais selecionados,
    // mapeando os dados do quarto e dos adicionais para o formato esperado pelos badges
    // { label: string, value: string }
    const summaryBadges = computed(() => [
        {
            label: "Tarifa base",
            value:
                props.room.value?.basePrice != null
                    ? `R$ ${props.room.value?.basePrice.toFixed(2)}`
                    : "R$ --,--",
        },
        {
            label: "Capacidade",
            value: `${props.room.value?.baseCapacity ?? "--"} pessoas`,
        },
        {
            label: "Extras",
            value: `${booleanAdditionals.value.length} opcoes`,
        },
    ])

    //handler que irá lidar com a submissão do formulário de reserva, 
    // enviando os dados para a API e tratando as respostas de sucesso e erro, exibindo mensagens de toast e 
    // redirecionando o usuário conforme necessário
    async function onSubmitFormHandler(
        event: FormSubmitEvent<ReservationFormSchema>,
    ) {
        const body = {
            quartoId: props.room.value?.id,
            person: event.data.guests,
            stayTime: event.data.hours,
            additionals: {
                quantityAdditionals: event.data.quantityAdditionals,
                booleanAdditionals: event.data.booleanAdditionals,
            },
        }

        try {
            const response = await $fetch("/api/reservation/new", {
                method: "POST",
                body,
            })

            if (response) {
                toast.add({
                    title: "Reserva criada com sucesso!",
                    description:
                        "Sua reserva foi criada e está pendente de confirmação.",
                    color: "success",
                    duration: 3000,
                })

                navigateTo("/dashboard/reservation/my")
            }
        } catch (error: FetchError | unknown) {
            if (error instanceof FetchError) {
                console.error(
                    "FetchError:",
                    error.message,
                    "Status:",
                    error.status,
                )
                toast.add({
                    title: "Erro ao criar reserva!",
                    description:
                        error.data?.message || "Ocorreu um erro inesperado.",
                    color: "error",
                    duration: 3000,
                })
                navigateTo("/dashboard/reservation/my")
            } else {
                console.error("Unexpected error:", error)
            }
        }
    }

    return {
        state,
        hourItems,
        itemsCheckBoxGroupBoolean,
        summaryBadges,
        quantityAdditionals,
        booleanAdditionals,
        onSubmitFormHandler,
    }
}
