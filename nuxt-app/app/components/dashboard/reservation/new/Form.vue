<script setup lang="ts">
import { type AdicionalItem, type Quarto } from "~/lib/db/schemas"

import {
    reservationFormSchema,
    type ReservationFormSchema,
} from "~/utils/schemas/newReservationSchema"
import { useReservationForm } from "~/composables/useReservationForm"

const props = defineProps<{
    room: Quarto | undefined
    additionals: AdicionalItem[] | undefined
}>()

const emits = defineEmits<{
    (event: "extract-change", payload: ReservationFormSchema): void
}>()

const {
    state,
    hourItems,
    itemsCheckBoxGroupBoolean,
    summaryBadges,
    quantityAdditionals,
    onSubmitFormHandler,
} = useReservationForm({
    room: toRef(props, "room"),
    additionals: toRef(props, "additionals"),
})

watch(state, (newVal) => {
    emits("extract-change", {
        hours: newVal.hours ?? "",
        guests: newVal.guests ?? 0,
        booleanAdditionals: newVal.booleanAdditionals ?? [],
        quantityAdditionals: newVal.quantityAdditionals ?? {},
    })
})

const toast = useToast()
</script>

<template>
    <UCard
        class="border-0 bg-white/95 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/80 backdrop-blur"
        :ui="{
            header: 'px-6 py-5 sm:px-7',
            body: 'px-6 pb-6 sm:px-7',
        }"
    >
        <!-- Cabeçalho -->
        <template #header>
            <div class="space-y-4">
                <div class="space-y-2">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500"
                    >
                        Personalizacao da reserva
                    </p>
                    <h2
                        class="text-2xl font-semibold tracking-tight text-slate-950"
                    >
                        Monte sua estadia
                    </h2>
                    <p class="text-sm leading-6 text-slate-600">
                        Defina a duracao, ajuste a quantidade de hospedes e
                        selecione os adicionais que fazem sentido para esta
                        reserva.
                    </p>
                </div>

                <div class="grid gap-3 sm:grid-cols-3">
                    <div
                        v-for="badge in summaryBadges"
                        :key="badge.label"
                        class="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    >
                        <p
                            class="text-xs uppercase tracking-[0.2em] text-slate-500"
                        >
                            {{ badge.label }}
                        </p>
                        <p class="mt-2 font-semibold text-slate-900">
                            {{ badge.value }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <!-- Formulário -->
        <UForm
            class="space-y-6"
            :state="state"
            :schema="reservationFormSchema"
            @submit="onSubmitFormHandler"
        >
            <!-- Opções Principais -->
            <section
                class="space-y-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200/80"
            >
                <div class="space-y-1">
                    <h3 class="text-lg font-semibold text-slate-900">
                        Dados principais
                    </h3>
                    <p class="text-sm text-slate-600">
                        Primeiro, escolha a configuracao base da sua reserva.
                    </p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <UFormField
                        :required="true"
                        label="Quantas horas sera sua estadia?"
                        name="hours"
                        size="md"
                    >
                        <USelect
                            v-model="state.hours"
                            :items="hourItems"
                            arrow
                            placeholder="Selecione a duracao"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        :required="true"
                        label="Numero de hospedes"
                        name="guests"
                        size="md"
                    >
                        <UInputNumber
                            v-model="state.guests"
                            variant="soft"
                            :min="0"
                            :max="room?.maxCapacity ?? 5"
                            class="w-full"
                        />
                    </UFormField>
                </div>
            </section>

            <!-- Adicionais de quantidade -->
            <section
                class="space-y-4 rounded-3xl bg-[linear-gradient(135deg,#fff8e8_0%,#fffef8_100%)] p-5 ring-1 ring-amber-200/80"
            >
                <div class="space-y-1">
                    <h3 class="text-lg font-semibold text-slate-900">
                        Opcionais com quantidade
                    </h3>
                    <p class="text-sm text-slate-600">
                        Ative o opcional e ajuste a quantidade conforme
                        necessario.
                    </p>
                </div>

                <div class="flex flex-col">
                    <div
                        v-if="quantityAdditionals?.length > 0"
                        v-for="additional in quantityAdditionals"
                        :key="additional.id"
                        class="rounded-2xl bg-white/80 p-4 ring-1 ring-amber-200/80 flex flex-col gap-4 md:flex-row"
                    >
                        <UFormField
                            :label="`Deseja ${additional.name}?`"
                            orientation="horizontal"
                            :name="`quantityAdditionals.${additional.id}.isMarked`"
                            class="flex items-center justify-start gap-4 my-4 flex-1"
                        >
                            <UCheckbox
                                v-model="
                                    state.quantityAdditionals[additional.id]!
                                        .isMarked
                                "
                            />
                        </UFormField>

                        <UFormField
                            label="Quantas?"
                            class="rounded-2xl bg-white/80 ring-amber-200/80 my-4 flex-2"
                            :name="`quantityAdditionals.${additional.id}.quantity`"
                            :ui="{ error: 'text-[12px]' }"
                        >
                            <UInputNumber
                                v-model="
                                    state.quantityAdditionals[additional.id]!
                                        .quantity
                                "
                                :increment="false"
                                :decrement="false"
                                :min="-1"
                                :max="5"
                                variant="soft"
                                class="w-full"
                                :disabled="
                                    !state.quantityAdditionals[additional.id]
                                        ?.isMarked
                                "
                            />
                        </UFormField>
                    </div>
                </div>
            </section>

            <!-- Adicionais de marcação -->
            <section
                class="space-y-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200/80"
            >
                <div class="space-y-1">
                    <h3 class="text-lg font-semibold text-slate-900">
                        Adicionais opcionais
                    </h3>
                    <p class="text-sm text-slate-600">
                        Selecione os servicos extras que deseja incluir na
                        estadia.
                    </p>
                </div>

                <UFormField label="Itens disponiveis" name="booleanAdditionals">
                    <UCheckboxGroup
                        v-model="state.booleanAdditionals"
                        :items="itemsCheckBoxGroupBoolean"
                        class="grid gap-3"
                    />
                </UFormField>
            </section>

            <!-- Botão de confirmação -->
            <div
                class="flex items-center justify-between gap-4 rounded-3xl bg-slate-950 px-5 py-4 text-white"
            >
                <div>
                    <p class="text-sm font-medium">Pronto para reservar?</p>
                    <p class="text-sm text-white/65">
                        Revise o extrato ao lado antes de confirmar.
                    </p>
                </div>
                <UButton
                    type="submit"
                    label="Confirmar reserva"
                    color="neutral"
                    size="xl"
                />
            </div>
        </UForm>
    </UCard>
</template>
