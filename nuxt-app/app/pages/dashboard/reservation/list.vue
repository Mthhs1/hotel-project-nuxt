<script setup lang="ts">
import ReservationList from "~/components/dashboard/reservation/reservationList.vue"
import { type Quarto } from "~/lib/db/schemas/quarto"

let rooms: Quarto[]

const page = 1
const pagination = 3

rooms = await $fetch("/api/rooms/all", {
    method: "GET",
    query: { pagination, page },
})

const itemsSelectOrder = ref(["Preço", "Desconto"])
const valueSelectOrder = ref<string | undefined>()
</script>

<template>
    <div class="flex flex-col gap-4">
        <UContainer>
            <UCard variant="soft" class="bg-white">
                <template #header>
                    <div class="flex flex-col justify-between md:flex-row">
                        <h3>Veja as acomodações disponíveis!</h3>
                        <div class="flex gap-4 items-center">
                            <h3>Filtros</h3>
                            <USelect
                                placeholder="Ordem"
                                v-model="valueSelectOrder"
                                :items="itemsSelectOrder"
                            />
                        </div>
                    </div>
                </template>
            </UCard>
        </UContainer>

        <UContainer>
            <ReservationList :rooms="rooms" />
        </UContainer>
    </div>
</template>
