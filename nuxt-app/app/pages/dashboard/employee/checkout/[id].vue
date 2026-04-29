<script setup lang="ts">
// Componentes
import ExtractNewReservation from "~/components/dashboard/reservation/new/extractNewReservation.vue"
import Form from "~/components/dashboard/reservation/new/Form.vue"
import NewReservationRoomCard from "~/components/dashboard/reservation/new/newReservationRoomCard.vue"
// Composables
import { useReservationSummary } from "~/composables/useReservationSummary"
// Tipagem
import type { Quarto, AdicionalConsumido } from "~/lib/db/schemas/index"

const route = useRoute()
const reservationId = Number(route.params.id)

const fetchRoomByReservationId = async (
    id: number,
): Promise<
    | {
          room: Quarto | undefined
          initialState: {
              hours: number
              guests: number
              additionalsConsumed: AdicionalConsumido[]
          } | null
      }
    | undefined
> => {
    try {
        const response = await $fetch("/api/employee/some-rooms", {
            method: "GET",
            query: {
                reservationId: id,
                limit: 1,
            },
            headers: useRequestHeaders(["cookie"]),
        })

        const initialState = {
            hours: response.hours ?? 0,
            guests: response.guests ?? 1,
            additionalsConsumed: response.additionals ?? [],
        }

        return {
            room: response.room,
            initialState,
        }
    } catch (error) {
        console.error("Error fetching room data:", error)
        throw error
    }
}

const {
    room,
    additionalsDB,
    prices,
    formInfoRetrieved,
    initialState,
    handleExtractChange,
} = await useReservationSummary(
    "get-selected-room-new-reservation",
    reservationId,
    fetchRoomByReservationId,
)
</script>

<template>
    <div
        class="min-h-full bg-[radial-gradient(circle_at_top,#e4eef6_0%,#f7f5ef_38%,#f8fafc_100%)] rounded-xl"
    >
        <UContainer class="py-6 sm:py-8">
            <div class="space-y-6">
                <!-- Cartão de visualização do quarto -->
                <NewReservationRoomCard :room="room" />

                <!-- Criação da reserva -->
                <div class="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_400px]">
                    <!-- Formulário de criação da reserva -->
                    <Form
                        :additionals="additionalsDB"
                        :initial-state="initialState!"
                        :room="room"
                        mode="employee"
                        @extract-change="handleExtractChange"
                    />

                    <!-- Extrato da reserva. -->
                    <div class="xl:sticky xl:top-6 xl:self-start">
                        <ExtractNewReservation
                            :additionals="additionalsDB"
                            :prices="prices"
                            :guests="formInfoRetrieved.guests"
                            :hours="formInfoRetrieved.hours"
                            :room="room!"
                        />
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>
