<script setup lang="ts">
import type { CheckboxGroupItem } from "@nuxt/ui"
import { type AdicionalItem, type Quarto, type Reserva } from "~/lib/db/schemas"
import { FetchError } from 'ofetch'

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

const emits = defineEmits<{
    (event: "extract-change", payload: ExtractOptions): void
}>()

const hourItems = ref(["2 horas", "4 horas", "6 horas", "8 horas", "Per noite"])
const hourValue = ref("")

const numberGuests = ref(1)
const numberGarage = ref(0)
const valueGarage = ref(false)

function handleGarageNumberIsDisable() {
    if (!valueGarage.value) {
        numberGarage.value = 0
    } else {
        numberGarage.value = 1
    }
}

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

const valueAdditionals = ref<Array<string>>([])

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

async function onSubmitForm () {
    
    const body = {
        quartoId: props.room?.id,
        person: numberGuests.value,
        stayTime: hourValue.value,
        additionals: [...valueAdditionals.value],
    }

    console.log(body)

    try {
        const response = await $fetch("/api/reservation/new",{
            method: "POST",
            body,
        })
        console.log(response)
    } catch (error: FetchError | unknown) {
        if (error instanceof FetchError) {
            console.error("FetchError:", error.message, "Status:", error.status)
        } else {
            console.error("Unexpected error:", error)
        }
    }
}

</script>

<template>
    <div class="p-4 bg-white rounded-sm border border-gray-200 relative">
        <UForm class="flex flex-col gap-5" @submit="onSubmitForm">
            <!-- Horas -->
            <UFormField
                :required="true"
                label="Quantas horas será sua estadia?"
            >
                <USelect
                    v-model="hourValue"
                    :items="hourItems"
                    arrow
                    placeholder="Horas"
                />
            </UFormField>

            <!-- Qntd Hóspedes -->
            <UFormField :required="true" label="Número de hóspedes">
                <UInputNumber
                    variant="soft"
                    v-model="numberGuests"
                    :min="1"
                    :max="5"
                />
            </UFormField>

            <!-- Garagem -->
            <div class="flex items-center gap-12 h-12">
                <UFormField
                    class="flex items-center"
                    label="Deseja vaga na garagem?"
                    orientation="horizontal"
                >
                    <UCheckbox
                        v-model="valueGarage"
                        @update:model-value="handleGarageNumberIsDisable"
                    />
                </UFormField>

                <Transition>
                    <UFormField
                        v-if="valueGarage"
                        label="Quantas?"
                        orientation="horizontal"
                    >
                        <UInputNumber
                            :ui="{ base: 'w-16' }"
                            :increment="false"
                            :decrement="false"
                            :min="1"
                            :max="5"
                            variant="soft"
                            v-model="numberGarage"
                            :disabled="!valueGarage"
                        />
                    </UFormField>
                </Transition>
            </div>

            <!-- Adicionais opcionais -->
            <UFormField label="Deseja algum adicional para a sua estadia?">
                <UCheckboxGroup
                    @change="console.log(valueAdditionals)"
                    v-model="valueAdditionals"
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
