<!-- eslint-disable style/brace-style -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore"
import TheSpinner from "./utils/TheSpinner.vue"

const authStore = useAuthStore()

onMounted(async () => {
    try {
        await authStore.checkAuth()
    } catch (error) {
        console.log(error)
    }
})
</script>

<template>
    <UApp>
        <NuxtPage v-if="authStore.GETisLoadingPage">
            <TheSpinner />
        </NuxtPage>
        <NuxtPage v-else />
    </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
    filter: blur(1rem);
}
</style>
