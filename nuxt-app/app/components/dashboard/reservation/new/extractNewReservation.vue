<script lang="ts" setup>
import { type Quarto, type AdicionalItem } from "~/lib/db/schemas"

const props = defineProps<{
    isGarageSelected: boolean
    numberGarage: number
    guests: number
    hours: string
    hoursPrice: number | undefined
    additionals: string[]
    room: Quarto | undefined
    additionalsPrice: Record<string, AdicionalItem>
}>()

const guestsExceedBaseCapacity = computed(() => {
    return props.guests > (props.room?.baseCapacity || 0)
})

const isExtractBlank = computed(() => {
    return (
        !props.isGarageSelected &&
        !guestsExceedBaseCapacity.value &&
        props.hours === "" &&
        props.additionals.length === 0
    )
})
</script>

<template>
    <div
        v-if="!isExtractBlank"
        class="text-sm text-gray-700 flex flex-col gap-4 border rounded-sm p-4 shadow-sm/1"
    >
        <h3 class="text-xl">Adicionais</h3>
        <div class="">
            <!-- Horas -->
            <div v-if="hours" class="flex justify-between">
                <span>Horas: {{ hours }}</span
                ><span>Valor: {{ hoursPrice || 0 }}</span>
            </div>

            <!-- hóspedes -->
            <div v-if="guestsExceedBaseCapacity" class="flex justify-between">
                <span>Convidados: {{ guests }}</span
                ><span
                    >Valor:
                    {{
                        (guests - (room?.baseCapacity ?? 0)) *
                        (room?.extraPersonPrice ?? 0)
                    }}</span
                >
            </div>

            <!-- Garagem -->
            <div v-if="isGarageSelected" class="flex justify-between">
                <span>Garagem: {{ numberGarage }}</span
                ><span
                    >Valor:
                    {{
                        (additionalsPrice["Garagem"]?.basePrice ?? 0) *
                        numberGarage
                    }}</span
                >
            </div>

            <!-- Adicionais -->
            <div v-if="additionals.length > 0">
                <div
                    v-for="additional in additionals"
                    :key="additional"
                    class="flex justify-between"
                >
                    <span>{{ additional }}</span
                    ><span
                        >Valor:
                        {{ additionalsPrice[additional]?.basePrice }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>
