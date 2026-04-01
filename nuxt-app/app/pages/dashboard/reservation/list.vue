<script setup lang="ts">
import ReservationListAvailable from "~/components/dashboard/reservation/list/reservationListAvailable.vue"
import { type Quarto } from "~/lib/db/schemas/quarto"
import { type AdicionalItem } from "~/lib/db/schemas/adicionalItem"

const toast = useToast()

const rooms = ref<{ quarto: Quarto; adicionais: AdicionalItem[] }[]>()
const totalNumberRooms = ref<number | undefined>()
const page = ref(1)
const selectedRoom = ref<number | null>()
const itemsPerPage = ref(2)
const buttonColor = ref("neutral")

const response = await useAsyncData("get-first-rooms", async () => {
    const response = await $fetch("/api/rooms/all", {
        method: "GET",
        query: { itemsPerPage: itemsPerPage.value, page: page.value },
    })

    return response
})

rooms.value = response.data.value?.rooms
totalNumberRooms.value = response.data.value?.numberRooms

const itemsSelectOrder = ref(["Preço", "Desconto"])
const valueSelectOrder = ref<string | undefined>()

async function handleNewPageList(value: number) {
    const response = await $fetch("/api/rooms/all", {
        method: "GET",
        query: { itemsPerPage: itemsPerPage.value, page: page.value },
    })
    console.log("oi")
    rooms.value = response.rooms
    totalNumberRooms.value = response.numberRooms
}

function handleSelectedRoomEvent(value: number | null) {
    selectedRoom.value = value
    buttonColor.value = "neutral"
}

function handleReserveButtonClick() {
    if (selectedRoom.value != null) {
        navigateTo({
            path: "/dashboard/reservation/new",
            query: { id: selectedRoom.value },
        })
    } else {
        buttonColor.value = "error"
        toast.add({
            title: "Erro ao fazer reserva!",
            description: "Você deve selecionar ao menos um quarto!",
            color: "error",
            duration: 3000,
        })
    }
}
</script>

<template>
    <div class="flex flex-col h-full items-center">
        <div class="flex-1 w-full class flex flex-col gap-4">
            <UContainer>
                <UCard variant="soft" class="bg-white">
                    <template #header>
                        <div
                            class="flex flex-col justify-between items-center md:flex-row"
                        >
                            <h3>Veja as acomodações disponíveis!</h3>
                            <div class="flex gap-4 items-center">
                                <h3>Filtros</h3>
                                <USelect
                                    placeholder="Ordem"
                                    v-model="valueSelectOrder"
                                    :items="itemsSelectOrder"
                                />
                                <USeparator
                                    color="neutral"
                                    orientation="vertical"
                                />
                                <UButton
                                    color="neutral"
                                    label="Fazer Reserva"
                                    @click="handleReserveButtonClick"
                                />
                            </div>
                        </div>
                    </template>
                </UCard>
            </UContainer>

            <UContainer>
                <ReservationListAvailable
                    :rooms="rooms"
                    @selected-room-event="
                        (value: number | null) => {
                            handleSelectedRoomEvent(value)
                        }
                    "
                />
            </UContainer>
        </div>
        <UPagination
            class="mt-auto"
            :show-controls="false"
            :items-per-page="itemsPerPage"
            :total="totalNumberRooms"
            v-model:page="page"
            @update:page="handleNewPageList"
        />
    </div>
</template>
