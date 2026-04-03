<script setup lang="ts">
import { type Quarto, type Reserva } from "~/lib/db/schemas"
import { callWithNuxt } from "#app"

const response = await useAsyncData("get-my-reservation", async () => {
    const nuxtApp = useNuxtApp()

    const route = useRoute()
    const params = route.params
    const id = Number(params.id)

    const responseReservation = await $fetch("/api/reservation/some", {
        method: "GET",
        query: {
            id: id,
        },
        headers: useRequestHeaders(["cookie"]),
    })

    if (!responseReservation) {
        console.log("Reserva não encontrada, redirecionando para dashboard")
        await callWithNuxt(nuxtApp, navigateTo, ["/dashboard"])
    }

    return responseReservation
})

const reservation = ref<
    { quarto: Quarto | null; reserva: Reserva } | null | undefined
>(response.data.value)
const a = reservation.value

type BadgeColor =
    | "success"
    | "warning"
    | "error"
    | "primary"
    | "secondary"
    | "info"
    | "neutral"

const mapStatusToColor: Record<string, BadgeColor> = {
    reserved: "success",
    pending: "warning",
    cancelled: "error",
    neutral: "neutral",
}

const mapStatusToText: Record<string, string> = {
    reserved: "Reservado",
    pending: "Pendente",
    cancelled: "Cancelado",
}
</script>

<template>
    <div class="flex flex-col min-h-full gap-4 pb-6">
        <UContainer>
            <UCard variant="soft" class="bg-white">
                <!-- Titulo -->
                <template #header>
                    <div
                        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                    >
                        <div class="flex items-start gap-3">
                            <!-- Arrow left (back) -->
                            <UButton
                                to="/dashboard/reservation/my"
                                icon="tabler:arrow-left"
                                variant="ghost"
                                color="neutral"
                            />

                            <!-- Title and Subtitle -->
                            <div class="space-y-1">
                                <h2
                                    class="text-xl font-semibold text-neutral-900"
                                >
                                    Detalhes da reserva
                                </h2>
                                <p class="text-sm text-neutral-500">
                                    Acompanhe as principais informações da sua
                                    hospedagem.
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex flex-col items-start gap-3 sm:flex-row sm:items-center"
                        >
                            <!-- Badge de Status -->
                            <UBadge
                                :color="
                                    mapStatusToColor[
                                        reservation?.reserva.status ?? 'neutral'
                                    ]
                                "
                                variant="soft"
                                size="lg"
                            >
                                {{
                                    mapStatusToText[
                                        reservation?.reserva.status ?? "neutral"
                                    ] || "Status desconhecido"
                                }}
                            </UBadge>

                            <!-- Botao de contato (depois redirecionar para /contate-nos) to="/contact" -->
                            <UButton
                                label="Entrar em contato"
                                color="neutral"
                                variant="outline"
                                icon="tabler:message"
                            />
                        </div>
                    </div>
                </template>

                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <!-- ID da Reserva -->
                    <div
                        class="rounded-xl border border-neutral-200 p-4 space-y-1"
                    >
                        <p class="text-sm text-neutral-500">Reserva</p>
                        <p class="text-lg font-semibold text-neutral-900">
                            #{{ reservation?.reserva?.id || "--" }}
                        </p>
                    </div>

                    <!-- Check-in -->
                    <div
                        class="rounded-xl border border-neutral-200 p-4 space-y-1"
                    >
                        <p class="text-sm text-neutral-500">Check-in</p>
                        <p class="text-lg font-semibold text-neutral-900">
                            {{
                                reservation?.reserva?.checkIn
                                    ? new Date(
                                          reservation?.reserva?.checkIn,
                                      ).toLocaleDateString("pt-BR")
                                    : "--/--/----"
                            }}
                        </p>
                    </div>

                    <!-- Check-out -->
                    <div
                        class="rounded-xl border border-neutral-200 p-4 space-y-1"
                    >
                        <p class="text-sm text-neutral-500">Check-out</p>
                        <p class="text-lg font-semibold text-neutral-900">
                            {{
                                reservation?.reserva?.checkOut
                                    ? new Date(
                                          reservation?.reserva?.checkOut,
                                      ).toLocaleDateString("pt-BR")
                                    : "--/--/----"
                            }}
                        </p>
                    </div>

                    <!-- Quantidade de hóspedes -->
                    <div
                        class="rounded-xl border border-neutral-200 p-4 space-y-1"
                    >
                        <p class="text-sm text-neutral-500">Hóspedes</p>
                        <p class="text-lg font-semibold text-neutral-900">
                            {{ reservation?.reserva.person || "--" }}
                        </p>
                    </div>
                </div>
            </UCard>
        </UContainer>

        <UContainer>
            <div
                class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            >
                <UCard class="bg-white">
                    <!-- Header (título e botao) -->
                    <template #header>
                        <div
                            class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <h3
                                    class="text-lg font-semibold text-neutral-900"
                                >
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
                        <div
                            class="overflow-hidden rounded-2xl bg-neutral-100 min-h-64"
                        >
                            <img
                                v-if="response.data?.reservation?.quarto?.url"
                                :src="`${response.data.reservation.quarto.url}1.jpg`"
                                :alt="
                                    response.data?.reservation?.quarto
                                        ?.roomType || 'Quarto reservado'
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
                                <h4
                                    class="text-2xl font-semibold text-neutral-900"
                                >
                                    {{
                                        reservation?.quarto?.roomType ||
                                        "Quarto não encontrado"
                                    }}
                                </h4>
                                <p class="text-sm leading-6 text-neutral-600">
                                    {{
                                        reservation?.quarto?.description ||
                                        "Adicione a descrição da acomodação aqui."
                                    }}
                                </p>
                            </div>

                            <USeparator />

                            <div class="grid gap-4 sm:grid-cols-2">
                                <!-- Capacidade base -->
                                <div
                                    class="rounded-xl bg-neutral-50 p-4 space-y-1"
                                >
                                    <p class="text-sm text-neutral-500">
                                        Capacidade base
                                    </p>
                                    <p
                                        class="text-lg font-semibold text-neutral-900"
                                    >
                                        {{
                                            reservation?.quarto?.baseCapacity ||
                                            "--"
                                        }}
                                        pessoas
                                    </p>
                                </div>

                                <!-- Capacidade máxima -->
                                <div
                                    class="rounded-xl bg-neutral-50 p-4 space-y-1"
                                >
                                    <p class="text-sm text-neutral-500">
                                        Capacidade máxima
                                    </p>
                                    <p
                                        class="text-lg font-semibold text-neutral-900"
                                    >
                                        {{
                                            reservation?.quarto?.maxCapacity ||
                                            "--"
                                        }}
                                        pessoas
                                    </p>
                                </div>

                                <!-- Valor base a cada 2h -->
                                <div
                                    class="rounded-xl bg-neutral-50 p-4 space-y-1"
                                >
                                    <p class="text-sm text-neutral-500">
                                        Valor base a cada 2h
                                    </p>
                                    <p
                                        class="text-lg font-semibold text-neutral-900"
                                    >
                                        {{
                                            reservation?.quarto?.basePrice != null
                                                ? `R$ ${reservation?.quarto?.basePrice.toFixed(2)}`
                                                : "R$ --,--"
                                        }}
                                    </p>
                                </div>

                                <!-- Valor a cada pessoa extra -->
                                <div
                                    class="rounded-xl bg-neutral-50 p-4 space-y-1"
                                >
                                    <p class="text-sm text-neutral-500">
                                        Pessoa extra
                                    </p>
                                    <p
                                        class="text-lg font-semibold text-neutral-900"
                                    >
                                        {{
                                            4 - (reservation?.quarto?.baseCapacity ?? 0) > 0
                                                ? `R$ ${((4 - (reservation?.quarto?.baseCapacity ?? 0)) * (reservation?.quarto?.extraPersonPrice ?? 0)).toFixed(2)}`
                                                : "R$ --,--"
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </UCard>

                <div class="flex flex-col gap-4">
                    <!-- Aside -->
                    <UCard class="bg-white">
                        <!-- Titulo -->
                        <template #header>
                            <div>
                                <h3
                                    class="text-lg font-semibold text-neutral-900"
                                >
                                    Resumo da estadia
                                </h3>
                                <p class="text-sm text-neutral-500">
                                    Visão rápida dos dados da sua reserva.
                                </p>
                            </div>
                        </template>

                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <div
                                    class="rounded-full bg-primary-50 p-2 text-primary"
                                >
                                    <UIcon name="tabler:calendar-event" />
                                </div>
                                <!-- Data de criação da reserva -->
                                <div class="space-y-1">
                                    <p class="text-sm text-neutral-500">
                                        Reserva criada em
                                    </p>
                                    <p class="font-medium text-neutral-900">
                                        {{
                                            reservation?.reserva?.createdAt
                                                ? new Date(
                                                      reservation?.reserva
                                                          ?.createdAt,
                                                  ).toLocaleDateString("pt-BR")
                                                : "--/--/----"
                                        }}
                                    </p>
                                </div>
                            </div>

                            <!-- Tempo de estadia -->
                            <div class="flex items-start gap-3">
                                <div
                                    class="rounded-full bg-primary-50 p-2 text-primary"
                                >
                                    <UIcon name="tabler:moon-stars" />
                                </div>
                                <div class="space-y-1">
                                    <p class="text-sm text-neutral-500">
                                        Tempo de estadia
                                    </p>
                                    <p class="font-medium text-neutral-900">
                                        {{
                                            reservation?.reserva?.stayTime ||
                                            "--"
                                        }}
                                        horas
                                    </p>
                                </div>
                            </div>

                            <!-- Quantidade de hóspedes -->
                            <div class="flex items-start gap-3">
                                <div
                                    class="rounded-full bg-primary-50 p-2 text-primary"
                                >
                                    <UIcon name="tabler:users" />
                                </div>
                                <div class="space-y-1">
                                    <p class="text-sm text-neutral-500">
                                        Quantidade de hóspedes
                                    </p>
                                    <p class="font-medium text-neutral-900">
                                        {{
                                            reservation?.reserva?.person || "--"
                                        }}
                                        pessoas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </UCard>

                    <!-- Aside Serviços inclusos -->
                    <UCard class="bg-white">
                        <template #header>
                            <div>
                                <h3
                                    class="text-lg font-semibold text-neutral-900"
                                >
                                    Serviços inclusos
                                </h3>
                                <p class="text-sm text-neutral-500">
                                    Benefícios padrões da sua acomodação.
                                </p>
                            </div>
                        </template>

                        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <div
                                class="flex items-center gap-3 rounded-xl border border-neutral-200 p-3"
                            >
                                <UIcon
                                    name="tabler:check"
                                    class="text-primary"
                                />
                                <span class="text-sm text-neutral-700">
                                    Serviços gerais
                                </span>
                            </div>

                            <div
                                class="flex items-center gap-3 rounded-xl border border-neutral-200 p-3"
                            >
                                <UIcon
                                    name="tabler:bath"
                                    class="text-primary"
                                />
                                <span class="text-sm text-neutral-700">
                                    Banheiro privativo
                                </span>
                            </div>

                            <div
                                class="flex items-center gap-3 rounded-xl border border-neutral-200 p-3"
                            >
                                <UIcon
                                    name="tabler:shirt"
                                    class="text-primary"
                                />
                                <span class="text-sm text-neutral-700">
                                    Guarda-roupa
                                </span>
                            </div>

                            <div
                                class="flex items-center gap-3 rounded-xl border border-neutral-200 p-3"
                            >
                                <UIcon
                                    name="tabler:tools-kitchen-3"
                                    class="text-primary"
                                />
                                <span class="text-sm text-neutral-700">
                                    Serviço de alimentação
                                </span>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </UContainer>
    </div>
</template>
