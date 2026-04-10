<script setup lang="ts">
import { type Quarto } from "~/lib/db/schemas"

const props = defineProps<{
    room: Quarto | undefined
}>()

// Mapeamento das informações importante sobre o quarto para exibição na visão geral, 
const roomHighlights = computed(() => [
    {
        label: "Capacidade base",   
        value: `${props.room?.baseCapacity ?? "--"} pessoas`,
    },
    {
        label: "Capacidade máxima",
        value: `${props.room?.maxCapacity ?? "--"} pessoas`,
    },
    {
        label: "A cada 2h",
        value:
            props.room?.basePrice != null
                ? `R$ ${props.room.basePrice.toFixed(2)}`
                : "R$ --,--",
    },
    {
        label: "Pessoa extra",
        value:
            props.room?.extraPersonPrice != null
                ? `R$ ${props.room.extraPersonPrice.toFixed(2)}`
                : "R$ --,--",
    },
])
</script>

<template>
    <UCard
        class="overflow-hidden border-0 bg-gray-100 shadow-lg"
        :ui="{
            body: 'p-0',
        }"
    >
        <div class="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">

            <!-- Imagem do quarto e descrição -->
            <div class="relative min-h-70 overflow-hidden">
                <img
                    v-if="room?.url"
                    :src="`${room.url}1.jpg`"
                    :alt="`Foto do ${room.roomType}`"
                    class="h-full w-full object-cover"
                />
                <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,15,24,0.08)_0%,rgba(7,15,24,0.72)_100%)]"
                />
                <div
                    class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 text-white"
                >
                    <UBadge
                        color="neutral"
                        variant="soft"
                        class="w-fit border border-white/20 bg-white/15 text-white backdrop-blur"
                    >
                        Reserva em andamento
                    </UBadge>
                    <div class="space-y-2">
                        <h1 class="text-3xl font-semibold tracking-tight">
                            {{ room?.roomType || "Seu quarto selecionado" }}
                        </h1>
                        <p class="max-w-xl text-sm leading-6 text-white/80">
                            Configure a estadia, selecione os extras desejados e
                            acompanhe o valor total em tempo real.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Aside infos -->
            <div class="flex flex-col justify-between gap-6 p-6">
                
                <!-- Título -->
                <div class="space-y-2 text-slate-900">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600"
                    >
                        Visão geral
                    </p>
                    <p class="text-sm leading-6 text-slate-700">
                        Um resumo rápido da acomodação para você ajustar a
                        reserva com mais segurança.
                    </p>
                </div>

                <!-- Informações principais -->
                <div class="grid gap-3 sm:grid-cols-2">
                    <div
                        v-for="highlight in roomHighlights"
                        :key="highlight.label"
                        class="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur"
                    >
                        <p
                            class="text-xs uppercase tracking-[0.2em] text-slate-500"
                        >
                            {{ highlight.label }}
                        </p>
                        <p class="mt-2 text-lg font-semibold text-slate-900">
                            {{ highlight.value }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </UCard>
</template>
