import { defineStore } from "pinia"

export const useRoomsStore = defineStore("roomsStore", () => {
    
    type Room = {
        type: string
        basePrice: number
        precoMultiplier: number
        url: string
        hasDiscount: boolean
    }

    const rooms = reactive([]) as Room[]

    function addRoom(room: Room): void {
        rooms.push(room)
    }

    return { rooms }
})
