<script setup lang="ts">
import { type AdicionalItem } from "~/lib/db/schemas"

const props = defineProps<{
    roomType: string
    status: string
    id: number
}>()

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

type BadgeColor =
    | "success"
    | "warning"
    | "error"
    | "primary"
    | "secondary"
    | "info"
    | "neutral"

interface MapStrToColor {
    [key: string]: BadgeColor
}

interface MapStrToText {
    [key: string]: string
}

const mapStatusToColor = reactive<MapStrToColor>({
    reserved: "success",
    pending: "warning",
    cancelled: "error",
})

const mapStatusToText: MapStrToText = {
    reserved: "Reservado",
    pending: "Pendente",
    cancelled: "Cancelado",
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
                            :color="mapStatusToColor[props.status]"
                            >{{ mapStatusToText[props.status] }}</UBadge
                        >
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>
