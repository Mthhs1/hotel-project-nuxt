<script setup lang="ts">
import TheFooter from "./TheFooter.vue"
import TheHeader from "./TheHeader.vue"
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <TheHeader />
        <main>
            <slot />
        </main>
        <TheFooter />
    </div>
</template>
