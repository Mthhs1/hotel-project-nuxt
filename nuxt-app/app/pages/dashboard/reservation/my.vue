<script setup lang="ts">
import ReservationListUser from "~/components/dashboard/reservation/my/reservationListUser.vue"
import { type SelectItem } from "@nuxt/ui"

const response = await useAsyncData("get-my-all-reservations", async () => {
    const responseReservations = await $fetch("/api/reservation/all", {
        method: "GET",
        query: {
            by: "id",
        },
        headers: useRequestHeaders(),
    })

    return { reservations: responseReservations }
})

const reservations = ref(response.data.value?.reservations || [])
// const itemsSorting = ref(["Data", "Status"])
// const itemsAscending = ref(["Ascendente", "Descendente"])

const itemsSorting = ref<SelectItem[]>([
    {
        label: "Data",
        value: "createdAt",
    },
    {
        label: "Status",
        value: "status",
    },
])

const itemsAscending = ref<SelectItem[]>([
    {
        label: "Ascendente",
        value: "asc",
    },
    {
        label: "Descendente",
        value: "desc",
    },
])

const valueSorting = ref<string | "">("")
const valueAscending = ref<string | "">("")

async function onChangeOrder() {

    if (valueSorting.value || valueAscending.value) {
        console.log("Dentro");
        
        const responseReservations = await $fetch("/api/reservation/all", {
            method: "GET",
            query: {
                by: valueSorting.value,
                ascending: valueAscending.value,
            },
            headers: useRequestHeaders(),
        })

        reservations.value = responseReservations
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
                            <h3>Veja as suas acomodações!</h3>
                            <div class="flex gap-4 items-center">
                                <h3>Filtros</h3>
                                <USelect
                                    class="w-24"
                                    v-model="valueSorting"
                                    :items="itemsSorting"
                                    placeholder="Ordem"
                                />
                                <USelect
                                    class="w-34"
                                    v-model="valueAscending"
                                    :items="itemsAscending"
                                    placeholder="Ordenação"
                                />
                                <USeparator
                                    color="neutral"
                                    orientation="vertical"
                                />
                                <UButton
                                    color="neutral"
                                    label="Filtrar"
                                    @click="onChangeOrder"
                                />
                            </div>
                        </div>
                    </template>
                </UCard>
            </UContainer>

            <UContainer>
                <ReservationListUser :reservations="reservations" />
            </UContainer>
        </div>
        <UPagination />
    </div>
</template>
