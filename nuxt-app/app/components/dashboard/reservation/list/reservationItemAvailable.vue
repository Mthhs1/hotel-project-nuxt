<script setup lang="ts">
import { type AdicionalItem } from "~/lib/db/schemas"

const props = defineProps({
    roomType: String,
    basePrice: Number,
    id: Number,
    status: String,
    url: String,
    icons: Array<String>,
    additionals: Array<AdicionalItem>,
})

const expandable = ref(false)

function changeExpandable(): void {
    expandable.value = !expandable.value
}

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
                        <UButton
                            icon="tabler:chevron-down"
                            variant="ghost"
                            @click="changeExpandable"
                        />
                        <h4 class="font-bold">{{ props.roomType }}</h4>
                    </div>
                    <UBadge
                        class=""
                        :color="
                            props.status === 'available' ? 'success' : 'error'
                        "
                        >{{
                            props.status === "available" ? "Disponível" : "Erro"
                        }}</UBadge
                    >
                </div>
            </template>

            <template #default v-if="expandable">
                <div class="flex justify-between">
                    <div class="relative w-48">
                        <img
                            class="rounded-md"
                            :src="`${props.url}1.jpg`"
                            :alt="`Foto ${props.roomType}`"
                        />
                    </div>

                    <!-- Adicionais p/ todo quarto -->
                    <div class="flex flex-col gap-2">
                        <h6>Serviços Garantidos</h6>
                        <div class="flex items-center gap-4">
                            <UIcon name="tabler:check" />
                            <p class="text-sm text-gray-800 font-extralight">
                                Serviços Gerais
                            </p>
                        </div>
                        <div class="flex items-center gap-4">
                            <UIcon name="tabler:bath" />
                            <p class="text-sm text-gray-800 font-extralight">
                                Banheiro
                            </p>
                        </div>
                        <div class="flex items-center gap-4">
                            <UIcon name="tabler:shirt" />
                            <p class="text-sm text-gray-800 font-extralight">
                                Guarda-roupa
                            </p>
                        </div>
                        <div class="flex items-center gap-4">
                            <UIcon name="tabler:tools-kitchen-3" />
                            <p class="text-sm text-gray-800 font-extralight">
                                Serviços de comida
                            </p>
                        </div>
                    </div>

                    <!-- Adicionais especificos -->
                    <div class="flex flex-col gap-2">
                        <h6>Serviços Opcionais</h6>
                        <div
                            class="flex items-center gap-4"
                            v-for="adicional in props.additionals"
                            :key="adicional.id"
                        >
                            <UIcon :name="adicional.icon" />
                            <p class="text-sm text-gray-800 font-extralight">
                                {{ adicional.name }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col justify-between">
                        <UButton
                            class="flex justify-center"
                            variant="soft"
                            color="info"
                            :to="`/rooms/${mapRoomsToId[!!props.roomType ? props.roomType : 1]}`"
                        >
                            Mais detalhes
                        </UButton>
                        <div class="flex items-center">
                            <h6>A partir de</h6>
                            <span
                                class="px-2 text-2xl text-green-400 font-bold"
                                >{{ `R$ ${props.basePrice?.toFixed(2)}` }}</span
                            >
                        </div>
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>
