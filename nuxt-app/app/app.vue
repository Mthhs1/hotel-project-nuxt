<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore"

import TheSpinner from "./utils/TheSpinner.vue"

const authStore = useAuthStore()

const data = useAsyncData("auth-init", async () => {
    await authStore.GETSession()
    return true
})

/*
onMounted(async () => {
    try {
        // Faz a requisição no navegador (sem se preocupar com cookies de SSR)
        authStore.SETisLoadingPage(true)
        const { data, error } = await authClient.getSession()
        console.log("Mounted")
        console.log(data)
        if (data) {
            authStore.SET_Session(data)
        }
    } catch (error) {
        console.error("Erro ao checar sessão:", error)
    }
    authStore.SETisLoadingPage(false)
})
*/
</script>

<template>
    <div>
        <NuxtLoadingIndicator color="#d97706" :height="3" />

        <div
            v-if="authStore.GET_isLoadingPage"
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
