<script setup lang="ts">
import TheHeader from "@/layout/TheHeader.vue"
import TheFooter from "~/layout/TheFooter.vue"
import MainHomeView from "./HomeView/MainHomeView.vue"
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <TheHeader />
        <MainHomeView class="flex-1" />
        <TheFooter />
    </div>
</template>
