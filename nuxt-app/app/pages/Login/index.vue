<script setup lang="ts">
import TheFooter from "~/layout/TheFooter.vue"
import TheHeader from "~/layout/TheHeader.vue"
import MainLoginView from "./MainLoginView.vue"
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <TheHeader />
        <MainLoginView />
        <TheFooter />
    </div>
</template>
