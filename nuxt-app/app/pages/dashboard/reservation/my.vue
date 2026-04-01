<script setup lang="ts">

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
                                />
                                <USeparator
                                    color="neutral"
                                    orientation="vertical"
                                />
                                <UButton
                                    color="neutral"
                                    label="Fazer Reserva"
                                    @click=""
                                />
                            </div>
                        </div>
                    </template>
                </UCard>
            </UContainer>

            <UContainer>
                <ReservationList
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
