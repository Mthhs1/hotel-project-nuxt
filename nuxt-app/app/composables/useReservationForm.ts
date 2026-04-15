import { ref, watch } from "vue"
import { type AdicionalItem, type Quarto } from "~/lib/db/schemas/index"
import { STAY_TIME_OPTIONS } from "../../shared/const/stayTime"
import { type ReservationFormSchema } from "~/utils/schemas/newReservationSchema"
import type { CheckboxGroupItem, FormSubmitEvent } from "@nuxt/ui"
import { FetchError } from "ofetch"

type props = Readonly<{
    room: Ref<Quarto | undefined>
    additionals: Ref<AdicionalItem[] | undefined>
}>

export function useReservationForm(props: props) {
    const toast = useToast()

    const hourItems = ref<string[]>(STAY_TIME_OPTIONS)

    const booleanAdditionals = computed(() => {
        return (props.additionals.value || []).filter(
            (additional) => additional.isOptional,
        )
    })

    const quantityAdditionals = computed(() => {
        return (
            props.additionals.value?.filter((additional) => {
                if (additional.selectionType === "quantity") {
                    return true
                }
            }) || []
        )
    })

    const quantityAdditionalsInitialState: Record<
        string,
        { isMarked: boolean; quantity: number }
    > = {}
    quantityAdditionals.value?.forEach((additional) => {
        Object.assign(quantityAdditionalsInitialState, {
            [String(additional.id)]: { isMarked: false, quantity: 0 },
        })
    })

    const state = reactive<ReservationFormSchema>({
        hours: "",
        guests: 1,
        booleanAdditionals: [],
        // Assumimos que os adicionais já chegam prontos e não mudam
        // durante o ciclo de vida deste formulário.
        quantityAdditionals: quantityAdditionalsInitialState,
    })

    const itemsCheckBoxGroupBoolean = computed<CheckboxGroupItem[]>(() =>
        booleanAdditionals.value
            .filter((additional) => {
                if (additional.selectionType === "boolean") {
                    return true
                }
            })
            .map((additional) => {
                return {
                    label: additional.name,
                    description: additional.description,
                    value: String(additional.id),
                }
            }),
    )

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
