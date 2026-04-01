<script setup lang="ts">
import type { CheckboxGroupItem } from "@nuxt/ui"
import type { FormSubmitEvent } from "@nuxt/ui"
import { type AdicionalItem, type Quarto } from "~/lib/db/schemas"
import { FetchError } from "ofetch"
import * as z from "zod"

const toast = useToast()

const props = defineProps<{
    room: Quarto | undefined
    additionals: AdicionalItem[] | undefined
}>()

interface ExtractOptions {
    garage: [boolean, number]
    guests: number
    hours: string
    additionals: string[]
}

const schema = z
    .object({
        hours: z.string().min(1, "Selecione a duração da estadia."),
        guests: z.number().min(1, "Selecione o número de hóspedes."),
        isGarageSelected: z.boolean(),
        numberGarage: z.number(),
        additionals: z.array(z.string()),
    })
    .refine(
        (data) => {
            if (data.isGarageSelected) {
                return data.numberGarage > 0
            }
            return true
        },
        {
            message: "Se deseja vaga na garagem, deve selecionar a quantidade.",
            path: ["numberGarage"],
        },
    )
    .transform((data) => {
        if (data.isGarageSelected) {
            return data
        } else {
            data.numberGarage = 0
            return data
        }
    })

type Schema = z.infer<typeof schema>

const state = reactive<Partial<Schema>>({
    hours: "",
    guests: 0,
    isGarageSelected: false,
    numberGarage: 0,
    additionals: [],
})

const emits = defineEmits<{
    (event: "extract-change", payload: ExtractOptions): void
}>()

const hourItems = ref(["2 horas", "4 horas", "6 horas", "8 horas", "Per noite"])

const itemsCheckboxGroupAdicionais = ref<CheckboxGroupItem[]>([
    {
        label: "Internet Cabeada",
        description: "Internet cabeada de ultravelocidade (wifi grátis).",
        value: "Internet cabeada",
    },
    {
        label: "Freezer",
        description: "Mini Freezer para armazenar alimentos/bebidas.",
        value: "Mini frigorífico",
    },
    {
        label: "TV",
        description: "Canais de TV fechada.",
        value: "Canais de TV fechada",
    },
])

/*
const allOptions = computed<ExtractOptions>(() => {
    return {
        garage: [valueGarage.value, numberGarage.value],
        guests: numberGuests.value,
        hours: hourValue.value,
        additionals: valueAdditionals.value,
    }
})
    

watch(allOptions, (newVal) => {
    emits("extract-change", newVal)
})
*/
async function onSubmitForm(event: FormSubmitEvent<Schema>) {

    const body = {
        quartoId: props.room?.id,
        person: event.data.guests,
        stayTime: event.data.hours,
        additionals: [...event.data.additionals],
    }

    console.log(body)

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
            console.error("FetchError:", error.message, "Status:", error.status)
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
</script>

<template>
    <div class="p-4 bg-white rounded-sm border border-gray-200 relative">
        <UForm
            class="flex flex-col gap-5"
            :state="state"
            :schema="schema"
            @submit="onSubmitForm"
        >
            <!-- Horas -->
            <UFormField
                :required="true"
                label="Quantas horas será sua estadia?"
                name="hours"
            >
                <USelect
                    v-model="state.hours"
                    :items="hourItems"
                    arrow
                    placeholder="Horas"
                />
            </UFormField>

            <!-- Qntd Hóspedes -->
            <UFormField
                :required="true"
                label="Número de hóspedes"
                name="guests"
            >
                <UInputNumber
                    variant="soft"
                    v-model="state.guests"
                    :min="1"
                    :max="5"
                />
            </UFormField>

            <!-- Garagem -->
            <div class="flex items-center gap-12 h-12">
                <!-- Garagem booleano -->
                <UFormField
                    class="flex items-center"
                    label="Deseja vaga na garagem?"
                    orientation="horizontal"
                    name="isGarageSelected"
                >
                    <UCheckbox v-model="state.isGarageSelected" />
                </UFormField>

                <!-- Garagem número -->
                <Transition>
                    <UFormField
                        v-if="state.isGarageSelected"
                        label="Quantas?"
                        orientation="horizontal"
                        name="numberGarage"
                    >
                        <UInputNumber
                            :ui="{ base: 'w-16' }"
                            :increment="false"
                            :decrement="false"
                            :min="0"
                            :max="5"
                            variant="soft"
                            v-model="state.numberGarage"
                            :disabled="!state.isGarageSelected"
                        />
                    </UFormField>
                </Transition>
            </div>

            <!-- Adicionais opcionais -->
            <UFormField
                label="Deseja algum adicional para a sua estadia?"
                name="additionals"
            >
                <UCheckboxGroup
                    @change="console.log(state.additionals)"
                    v-model="state.additionals"
                    :items="itemsCheckboxGroupAdicionais"
                />
            </UFormField>
            <UButton type="submit" label="Enviar" />
        </UForm>
    </div>
</template>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
