<script setup lang="ts">
import { number, string } from "zod"

const props = defineProps({
    roomType: String,
    basePrice: Number,
    id: Number,
    status: String,
})

const expandable = ref(false)

function changeExpandable(): void {
    expandable.value = !expandable.value
}
/*
function handleCheckBox() {
    emit("changedCheckBoxEvent", props.id)
}

const emit = defineEmits(["changedCheckBoxEvent"])
*/
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
                {{ props.roomType }}
                {{ props.basePrice }}
                <div>expandable</div>
            </template>
        </UCard>
    </div>
</template>
