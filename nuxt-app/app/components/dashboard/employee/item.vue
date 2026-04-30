<script setup lang="ts">
import {
    RESERVATION_STATUS_BADGE_COLOR,
    RESERVATION_STATUS_LABEL,
    type ReservationStatus,
} from "~/../shared/const/reservationStatus"

const props = defineProps<{
    roomType: string
    status: ReservationStatus
    id: number
    dateCrated: number
}>()

async function handleChangeReservationStatus() {
    try {
        await $fetch(
            "/api/employee/change-status-reservation",
            {
                method: "POST",
                headers: useRequestHeaders(),
                body: {
                    reservationId: props.id,
                    newStatus: "confirmed",
                },
            },
        )

        emits("status-changed")
    } catch (error) {
        console.error("Error changing reservation status:", error)
    }
}

const emits = defineEmits<{
    (event: "status-changed"): void
}>()
</script>

<template>
    <div>
        <UCard>
            <template #header>
                <div class="flex flex-row justify-between">
                    <div class="flex">
                        <h4 class="font-bold">{{ props.roomType }}</h4>
                    </div>
                    <div class="flex gap-4">
                        <UBadge
                            variant="outline"
                            class="w-20 flex justify-center"
                        >
                            <NuxtTime :datetime="dateCrated" locale="pt-Br" />
                        </UBadge>

                        <UButton
                            color="primary"
                            variant="soft"
                            class="p-1 w-24 flex justify-center"
                            >Ver detalhes
                        </UButton>

                        <UButton
                            v-if="status === 'confirmed'"
                            variant="soft"
                            color="neutral"
                            :to="`/dashboard/employee/checkout/${props.id}`"
                            label="Fazer Checkout"
                        />

                        <UButton
                            v-if="status === 'pending'"
                            label="Confirmar Reserva"
                            @click="handleChangeReservationStatus"
                        />

                        <UBadge
                            class="w-20 flex justify-center h-8"
                            :color="RESERVATION_STATUS_BADGE_COLOR[props.status]"
                            >{{ RESERVATION_STATUS_LABEL[props.status] }}</UBadge
                        >
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>
