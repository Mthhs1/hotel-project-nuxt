<script setup lang="ts">
import { type Quarto, type AdicionalItem } from "~/lib/db/schemas"

import ReservationItemAvailable from "./reservationItemAvailable.vue"

const props = defineProps({
    rooms: Object as () => { quarto: Quarto; adicionais: AdicionalItem[] }[],
})

const emits = defineEmits(["selectedRoomEvent"])

const selectedRoom = ref<Number | null>(null)

function changeSelectedRoom(bool: boolean | string, id: number): void {
    if (bool) {
        selectedRoom.value = id
        emits("selectedRoomEvent", selectedRoom.value)
    } else {
        selectedRoom.value = null
        emits("selectedRoomEvent", selectedRoom.value)
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-for="roomObj in props.rooms"
            class="flex flex-row justify-center items-center gap-4"
        >
            <UCheckbox
                :model-value="selectedRoom === roomObj.quarto.id"
                @update:model-value="
                    (bool: boolean) =>
                        changeSelectedRoom(bool, roomObj.quarto.id)
                "
            />
            <ReservationItemAvailable
                class="flex-1"
                :key="roomObj.quarto.id"
                :room-type="roomObj.quarto.roomType"
                :base-price="roomObj.quarto.basePrice"
                :status="roomObj.quarto.status"
                :url="roomObj.quarto.url"
                :additionals="roomObj.adicionais"
            />
        </div>
    </div>
</template>
