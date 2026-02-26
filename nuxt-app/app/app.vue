<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore"
import TheSpinner from "./utils/TheSpinner.vue"

const authStore = useAuthStore()
const nuxtApp = useNuxtApp()

nuxtApp.hook("page:start", () => {
    authStore.SETisLoadingPage(true)
})

nuxtApp.hook("page:finish", () => {
    authStore.SETisLoadingPage(false)
})

await callOnce("init-auth", async () => {
    await authStore.init()
})
</script>

<template>
    <div>
        <NuxtLoadingIndicator color="#d97706" :height="3" />

        <div
            v-if="authStore.GETisLoadingPage"
            class="fixed inset-0 z-9999 bg-white flex items-center justify-center transition-opacity duration-300"
        >
            <TheSpinner />
        </div>

        <UApp>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </UApp>
    </div>
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
