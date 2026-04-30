<script setup lang="ts">
import { type Quarto, type Reserva } from "~/lib/db/schemas"
import { type ReservationStatus } from "~/../shared/const/reservationStatus"

import ReservationItemUser from "./reservationItemUser.vue"

const props = defineProps<{
    reservations: Array<{ reserva: Reserva; quarto: Quarto | null }> | undefined
}>()

const emits = defineEmits(["selectedRoomEvent"])

const selectedRoom = ref<Number | null>(null)
</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-for="reservation in props.reservations"
            :key="reservation.reserva.id"
            class="flex flex-row justify-center items-center gap-4"
        >
            <ReservationItemUser
                :id="reservation.reserva.id"
                :room-type="reservation.quarto?.roomType || ''"
                :status="reservation.reserva.status as ReservationStatus"
                class="flex-1"
            />
        </div>
    </div>
</template>
