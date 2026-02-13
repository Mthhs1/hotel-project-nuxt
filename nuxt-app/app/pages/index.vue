<script setup lang="ts">
import Footer from "@/layout/Footer.vue"
import TheHeader from "@/layout/TheHeader.vue"
import MainHomeView from "./HomeView.vue/MainHomeView.vue"
</script>

<template>
    <div class="grid grid-cols-1 grid-rows-[6rem_minmax(0,1fr)_50px]">
        <TheHeader />
        <MainHomeView class="min-h-screen" />
        <Footer />
    </div>
</template>
