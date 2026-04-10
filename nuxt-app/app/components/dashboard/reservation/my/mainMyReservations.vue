<template>
    <div>
        <UCard class="bg-white">
            <!-- Header (título e botao) -->
            <template #header>
                <div
                    class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h3 class="text-lg font-semibold text-neutral-900">
                            Acomodação reservada
                        </h3>
                        <p class="text-sm text-neutral-500">
                            Informações gerais do quarto selecionado.
                        </p>
                    </div>

                    <UButton
                        label="Ver quarto"
                        color="primary"
                        variant="soft"
                    />
                </div>
            </template>

            <div class="grid gap-6 xl:grid-rows-[320px_minmax(0,1fr)]">
                <!-- Imagem do quarto -->
                <div
                    class="overflow-hidden rounded-2xl bg-neutral-100 min-h-64"
                >
                    <img
                        v-if="!!url"
                        :src="`${url}1.jpg`"
                        :alt="
                            roomType ||
                            'Quarto reservado'
                        "
                        class="h-full w-full object-cover"
                    />

                    <div
                        v-else
                        class="flex h-full min-h-64 items-center justify-center text-sm text-neutral-400"
                    >
                        Imagem da acomodação
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <!-- Tipo do quarto -->
                    <div class="space-y-2">
                        <p
                            class="text-sm uppercase tracking-wide text-neutral-400"
                        >
                            Tipo de quarto
                        </p>
                        <h4 class="text-2xl font-semibold text-neutral-900">
                            {{ roomType }}
                        </h4>
                        <p class="text-sm leading-6 text-neutral-600">
                            {{ description }}
                        </p>
                    </div>

                    <USeparator />

                    <!-- Informações do quarto -->
                    <div class="grid gap-4 sm:grid-cols-2">
                        <!-- Capacidade base -->
                        <MainBadgeMyReservations
                            :title="'Capacidade base'"
                            :value="baseCapacity ?? '--'"
                            >pessoas</MainBadgeMyReservations
                        >

                        <!-- Capacidade máxima -->
                        <MainBadgeMyReservations
                            :title="'Capacidade máxima'"
                            :value="maxCapacity ?? '--'"
                            >pessoas</MainBadgeMyReservations
                        >

                        <!-- Valor base a cada 2h -->
                        <MainBadgeMyReservations
                            :title="'Valor base a cada 2h'"
                            :value="
                                basePrice != null
                                    ? `R$ ${basePrice.toFixed(2)}`
                                    : 'R$ --,--'
                            "
                        />

                        <!-- Valor a cada pessoa extra -->
                        <MainBadgeMyReservations
                            :title="'Valor a cada 2h por pessoa extra'"
                            :value="
                                extraPersonPrice != null
                                    ? `R$ ${extraPersonPrice.toFixed(2)}`
                                    : 'R$ --,--'
                            "
                        />
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import MainBadgeMyReservations from "./mainBadgeMyReservations.vue"

const props = defineProps<{
    roomType: string
    description: string
    baseCapacity: number | null
    maxCapacity: number | null
    basePrice: number | null
    extraPersonPrice: number | null
    url: string | null
}>()
</script>
