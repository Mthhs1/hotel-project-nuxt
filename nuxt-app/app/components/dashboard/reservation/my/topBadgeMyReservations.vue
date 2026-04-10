<template>
    <div class="rounded-xl border border-neutral-200 p-4 space-y-1">
        <p class="text-sm text-neutral-500">{{ title }}</p>
        <p class="text-lg font-semibold text-neutral-900">
            #{{ value || "--" }}
        </p>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    value: string | number | Date
    title: string
}>()

</script>