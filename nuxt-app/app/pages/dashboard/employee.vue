<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui"
import List from "~/components/dashboard/employee/list.vue"
import { type Quarto    , type Reserva } from "~/lib/db/schemas/index"

definePageMeta({
    middleware: ["role-check"],
})


const { scrollToAnchor, scrollToTop } = useAnchorScroll({
  toTop: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: 0,
    }
  },
})

const reservations = ref<{ reserva: Reserva; quarto: Quarto | null}[]>()
const totalNumberRooms = ref<number | undefined>()

const page = ref(1)
const itemsPerPage = ref(8)

const response = await useAsyncData("get-first-rooms-employee", async () => {
    const { data, totalRoomsNumber } = await $fetch("/api/employee/all", {
        headers: useRequestHeaders(),
        method: "GET",
        query: { itemsPerPage: itemsPerPage.value, page: page.value },
    })

    return { data, totalRoomsNumber }
})

reservations.value = response.data.value?.data
totalNumberRooms.value = response.data.value?.totalRoomsNumber

const valueSelectOrder = ref<string | undefined>()
const itemsSelectOrder = ref<SelectItem[]>([
    { label: "Data", value: "date" },
    { label: "Status", value: "status" },
])

async function handleChangePage(value: number) {
    page.value = value
    
    const { data, totalRoomsNumber } = await $fetch("/api/employee/all", {
        method: "GET",
        query: { itemsPerPage: itemsPerPage.value, page: value },
    })

    reservations.value = data
    totalNumberRooms.value = totalRoomsNumber
    scrollToTop()
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
                            <h3>Reservas Atuais</h3>
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
                                    label="Filtrar"
                                    @click=""
                                />
                            </div>
                        </div>
                    </template>
                </UCard>
            </UContainer>

            <UContainer>
                <List
                    :reservations="reservations"
                />
            </UContainer>
        </div>

        <UPagination
            class="mt-4"
            :show-controls="false"
            :items-per-page="itemsPerPage"
            :total="totalNumberRooms"
            v-model:page="page"
            @update:page="handleChangePage"
        />
    </div>
</template>
