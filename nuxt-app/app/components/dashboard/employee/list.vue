<script setup lang="ts">
import type { Quarto, Reserva } from "~/lib/db/schemas/index"
import { type ReservationStatus } from "~/../shared/const/reservationStatus"
import Item from "./item.vue"

const props = defineProps<{
    reservations: Array<{ reserva: Reserva; quarto: Quarto | null }> | undefined
}>()

const emits = defineEmits<{
    (event: "status-changed"): void
}>()
</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-for="reservation in props.reservations"
            :key="reservation.reserva.id"
            class="flex flex-row justify-center items-center gap-4"
        >
            <Item
                :id="reservation.reserva.id"
                :room-type="reservation.quarto?.roomType || ''"
                :status="reservation.reserva.status as ReservationStatus"
                :date-crated="reservation.reserva.createdAt"
                class="flex-1"
                @status-changed="emits('status-changed')"
            />
        </div>
    </div>
</template>
