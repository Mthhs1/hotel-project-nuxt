<template>
    <div class="rounded-xl bg-neutral-50 p-4 space-y-1">
        <p class="text-sm text-neutral-500">{{ title }}</p>
        <p class="text-lg font-semibold text-neutral-900">
            {{ value || "--" }}
            <slot />
        </p>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    value: number | string
    title: string
}>()
</script>