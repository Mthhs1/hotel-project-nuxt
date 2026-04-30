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
}>()

interface MapStrToNumber {
    [key: string]: number
}

const mapRoomsToId: MapStrToNumber = {
    "Quarto Luxuoso": 1,
    "Quarto Padrão": 2,
    "Quarto Classe Alta": 3,
}

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
                        <UButton
                            as="button"
                            :to="`/dashboard/reservation/my/${props.id}`"
                            color="primary"
                            class="p-1 w-24 flex justify-center"
                            >Ver detalhes
                        </UButton>
                        <UBadge
                            class=""
                            :color="RESERVATION_STATUS_BADGE_COLOR[props.status]"
                            >{{ RESERVATION_STATUS_LABEL[props.status] }}</UBadge
                        >
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>
