<script setup lang="ts">
import Footer from "@/layout/Footer.vue"
import TheHeader from "@/layout/TheHeader.vue"
import MainHomeView from "./HomeView.vue/MainHomeView.vue"
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <TheHeader />
        <MainHomeView class="flex-1" />
        <Footer />
        <Placeholder class="h-1500" />
    </div>
</template>
