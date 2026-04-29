<script lang="ts" setup>
import { type Quarto, type AdicionalItem } from "~/lib/db/schemas"

const props = defineProps<{
    additionals: Record<string, AdicionalItem>
    prices: {
        guestsPrice: number
        hoursPrice: number
        totalAdditionalsPrice: number
        booleanAdditionalsPrice: Record<string, number>
        quantityAdditionalsPrice: Record<
            string,
            { price: number; quantity: number }
        >
        totalPrice: number
    }
    guests: number
    hours: number
    room: Quarto
}>()

const visibleQuantityAdditionals = computed(() => {
    const visible: { name: string; quantity: number; total: number }[] = []

    for (const [id, { price, quantity }] of Object.entries(
        props.prices.quantityAdditionalsPrice,
    )) {
        if (
            props.additionals[id]?.selectionType === "quantity" &&
            price > 0
        ) {
            visible.push({
                name: props.additionals[id]?.name || "Adicional",
                quantity,
                total: price,
            })
        }
    }

    return visible
})

const visibleBooleanAdditionals = computed(() => {
    const visible: { name: string; price: number; description: string }[] = []

    for (const [id, price] of Object.entries(
        props.prices.booleanAdditionalsPrice,
    )) {
        if (
            props.additionals[id]?.selectionType === "boolean" &&
            price > 0
        ) {
            visible.push({
                name: props.additionals[id]?.name || "Adicional",
                price,
                description: props.additionals[id]?.description || "",
            })
        }
    }

    return visible
})

// Cálculo do excesso de hóspedes em relação à capacidade base do quarto,
// considerando apenas o número de hóspedes que excedem a capacidade base,
const guestsExceedBaseCapacity = computed(() => {
    return Math.max(props.guests - (props.room?.baseCapacity || 0), 0)
})

const emptyState = computed(
    () =>
        visibleBooleanAdditionals.value.length === 0 &&
        visibleQuantityAdditionals.value.length === 0 &&
        props.hours === 0 &&
        guestsExceedBaseCapacity.value === 0,
)

function formatCurrency(value: number) {
    return `R$ ${value.toFixed(2)}`
}

</script>

<template>
    <UCard
        class="border-0 bg-white/95 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.5)] ring-1 ring-slate-200/80 backdrop-blur"
        :ui="{
            header: 'px-6 py-5 sm:px-7',
            body: 'px-6 pb-6 sm:px-7',
        }"
    >
        <!-- Cabeçalho do cartão, com título e total -->
        <template #header>
            <div class="space-y-2">
                <p
                    class="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500"
                >
                    Extrato da reserva
                </p>
                <div class="flex items-end justify-between gap-4">
                    <div>
                        <h3 class="text-2xl font-semibold text-slate-950">
                            Resumo em tempo real
                        </h3>
                        <p class="mt-1 text-sm leading-6 text-slate-600">
                            Cada ajuste no formulário aparece aqui para
                            facilitar a conferência.
                        </p>
                    </div>
                    <div class="text-right">
                        <p
                            class="text-xs uppercase tracking-[0.22em] text-slate-500"
                        >
                            Total parcial
                        </p>
                        <p class="mt-1 text-3xl font-semibold text-slate-950">
                            {{ formatCurrency(prices.totalPrice || 0) }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <div class="space-y-5">
            <!-- Resumo dos itens da reserva -->
            <div class="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-3">
                <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p
                        class="text-[11px] uppercase tracking-[0.2em] text-slate-500"
                    >
                        Hóspedes
                    </p>
                    <p class="mt-2 text-xl font-semibold text-slate-900">
                        {{ guests || 0 }}
                    </p>
                </div>
                <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p
                        class="text-[11px] uppercase tracking-[0.2em] text-slate-500"
                    >
                        Duração
                    </p>
                    <p class="mt-2 text-xl font-semibold text-slate-900">
                        {{ hours || 0 }} horas
                    </p>
                </div>
                <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p
                        class="text-[11px] uppercase tracking-[0.2em] text-slate-500 overflow-clip"
                    >
                        Adicionais
                    </p>
                    <p class="mt-2 text-xl font-semibold text-slate-900">
                        {{
                            visibleBooleanAdditionals.length +
                            visibleQuantityAdditionals.length
                        }}
                    </p>
                </div>
            </div>

            <!-- Estado vazio -->
            <div
                v-if="emptyState"
                class="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-8 text-center"
            >
                <p class="text-base font-medium text-slate-800">
                    O extrato aparece conforme voce monta a reserva.
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-500">
                    Escolha a duracao, a quantidade de hospedes e os adicionais
                    desejados para visualizar o total.
                </p>
            </div>

            <div v-else class="space-y-3">
                <div
                    v-for="item in visibleBooleanAdditionals"
                    :key="`${item.name}-${item.description}`"
                    class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
                >
                    <div class="min-w-0">
                        <p class="font-medium text-slate-900">
                            {{ item.name }}
                        </p>
                    </div>
                    <p class="pl-4 text-right font-semibold text-slate-900">
                        {{ formatCurrency(item.price) }}
                    </p>
                </div>

                <div
                    v-for="item in visibleQuantityAdditionals"
                    :key="`${item.name}`"
                    class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
                >
                    <div class="min-w-0">
                        <p class="font-medium text-slate-900">
                            {{ item.name }}
                        </p>
                        <p class="text-xs text-slate-900">
                            Quantidade: {{ item.quantity }}
                        </p>
                    </div>
                    <p class="pl-4 text-right font-semibold text-slate-900">
                        {{ formatCurrency(item.total) }}
                    </p>
                </div>
            </div>

            <USeparator color="neutral" />

            <div class="space-y-3 rounded-3xl bg-slate-950 p-5 text-white">
                <div
                    class="flex items-center justify-between text-sm text-white/70"
                >
                    <span>Base por horas</span>
                    <span>{{ formatCurrency(prices.hoursPrice || 0) }}</span>
                </div>
                <!-- <div
                    class="flex items-center justify-between text-sm text-white/70"
                >
                    <span>Garagem</span>
                    <span>{{ formatCurrency(totalGarage) }}</span>
                </div> -->
                <div
                    class="flex items-center justify-between text-sm text-white/70"
                >
                    <span>Pessoas extras</span>
                    <span>{{ formatCurrency(prices.guestsPrice || 0) }}</span>
                </div>
                <div
                    class="flex items-center justify-between text-sm text-white/70"
                >
                    <span>Outros adicionais</span>
                    <span>{{
                        formatCurrency(prices.totalAdditionalsPrice || 0)
                    }}</span>
                </div>
                <USeparator color="neutral" class="opacity-20" />
                <div class="flex items-center justify-between">
                    <div>
                        <p
                            class="text-xs uppercase tracking-[0.22em] text-white/50"
                        >
                            Total estimado
                        </p>
                        <p class="mt-1 text-sm text-white/70">
                            Valor calculado com os extras selecionados
                        </p>
                    </div>
                    <p class="text-3xl font-semibold">
                        {{ formatCurrency(prices.totalPrice || 0) }}
                    </p>
                </div>
            </div>
        </div>
    </UCard>
</template>
