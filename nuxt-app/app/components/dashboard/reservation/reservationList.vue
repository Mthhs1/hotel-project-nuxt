<script setup lang="ts">
import { type Quarto } from "~/lib/db/schemas"
import ReservationItem from "./reservationItem.vue"

const props = defineProps({
    rooms: Array<Quarto>,
})

const selectedRoom = ref<Number | null>(null)

function changeSelectedRoom(id: number): void {
    selectedRoom.value = id
}

</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-for="roomObj in props.rooms"
            class="flex flex-row justify-center items-center gap-4"
        >
            <UCheckbox
                :model-value="selectedRoom === roomObj.id"
                @change="changeSelectedRoom(roomObj.id)"
            />
            <ReservationItem
                class="flex-1"
                :key="roomObj.id"
                :room-type="roomObj.roomType"
                :base-price="roomObj.basePrice"
                :status="roomObj.status"
            />
        </div>
    </div>
</template>
