<script setup lang="ts">
import { type Quarto, type Reserva } from "~/lib/db/schemas"
import { callWithNuxt } from "#app"
import TopBadgeMyReservations from "~/components/dashboard/reservation/my/topBadgeMyReservations.vue"
import MainMyReservations from "~/components/dashboard/reservation/my/mainMyReservations.vue"
import {
    RESERVATION_STATUS_BADGE_COLOR,
    RESERVATION_STATUS_LABEL,
    type ReservationStatus,
} from "~/../shared/const/reservationStatus"

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

const checkInDate = computed(() => {
    if (reservation.value?.reserva.checkIn) {
        return new Date(reservation.value.reserva.checkIn).toLocaleDateString(
            "pt-BR",
        )
    }
    return "--/--/----"
})

const checkOutDate = computed(() => {
    if (reservation.value?.reserva.checkOut) {
        return new Date(reservation.value.reserva.checkOut).toLocaleDateString(
            "pt-BR",
        )
    }
    return "--/--/----"
})
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
                                    reservation?.reserva.status
                                        ? RESERVATION_STATUS_BADGE_COLOR[reservation.reserva.status as ReservationStatus]
                                        : 'neutral'
                                "
                                variant="soft"
                                size="lg"
                            >
                                {{
                                    reservation?.reserva.status
                                        ? RESERVATION_STATUS_LABEL[reservation.reserva.status as ReservationStatus]
                                        : "Status desconhecido"
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

                <!-- Badges -->
                <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <!-- ID da Reserva -->
                    <TopBadgeMyReservations
                        title="Reserva"
                        :value="reservation?.reserva?.id || '--'"
                    />

                    <!-- Check-in -->
                    <TopBadgeMyReservations
                        title="Check-in"
                        :value="checkInDate"
                    />

                    <!-- Check-out -->
                    <TopBadgeMyReservations
                        title="Check-out"
                        :value="checkOutDate"
                    />
                </div>
            </UCard>
        </UContainer>

        <UContainer>
            <div
                class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
            >
                <!-- Main -->
                <MainMyReservations
                    :url="reservation?.quarto?.url || null"
                    :roomType="
                        reservation?.quarto?.roomType || 'Quarto não encontrado'
                    "
                    :description="
                        reservation?.quarto?.description ||
                        'Adicione a descrição da acomodação aqui.'
                    "
                    :baseCapacity="reservation?.quarto?.baseCapacity || null"
                    :maxCapacity="reservation?.quarto?.maxCapacity || null"
                    :basePrice="reservation?.quarto?.basePrice || null"
                    :extraPersonPrice="
                        reservation?.quarto?.extraPersonPrice || null
                    "
                />

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
