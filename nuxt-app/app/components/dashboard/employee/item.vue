<script setup lang="ts">
const props = defineProps<{
    roomType: string
    status: string
    id: number
    dateCrated: number
}>()

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
    Completed: "success",
    Confirmed: "info",
    pending: "warning",
    Cancelled: "error",
})

const mapStatusToText: MapStrToText = {
    Confirmed: "Confirmado",
    pending: "Pendente",
    Cancelled: "Cancelado",
    Completed: "Concluído",
}

async function handleChangeReservationStatus() {
    try {
        const response = await $fetch(
            "/api/employee/change-status-reservation",
            {
                method: "POST",
                headers: useRequestHeaders(),
                body: {
                    reservationId: props.id,
                    newStatus: "Confirmed",
                },
            },
        )

        console.log("Resposta da API (employee):", response)
        emits("status-changed")
    } catch (error) {
        console.error("Error changing reservation status:", error)
    }
}

const emits = defineEmits<{
    (event: "status-changed"): void
}>()
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
                        <UBadge
                            variant="outline"
                            class="w-20 flex justify-center"
                        >
                            <NuxtTime :datetime="dateCrated" locale="pt-Br" />
                        </UBadge>

                        <UButton
                            color="primary"
                            variant="soft"
                            class="p-1 w-24 flex justify-center"
                            >Ver detalhes
                        </UButton>

                        <UButton
                            v-if="status === 'Confirmed'"
                            variant="soft"
                            color="neutral"
                            :to="`/dashboard/employee/checkout/${props.id}`"
                            label="Fazer Checkout"
                        />

                        <UButton
                            v-if="status === 'pending'"
                            label="Confirmar Reserva"
                            @click="handleChangeReservationStatus"
                        />

                        <UBadge
                            class="w-20 flex justify-center"
                            :color="mapStatusToColor[props.status]"
                            >{{ mapStatusToText[props.status] }}</UBadge
                        >
                    </div>
                </div>
            </template>
        </UCard>
    </div>
</template>
