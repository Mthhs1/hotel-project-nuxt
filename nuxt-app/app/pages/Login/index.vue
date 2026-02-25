<script setup lang="ts">
import MainLoginView from '~/components/Login/MainLoginView.vue';
import TheFooter from '~/layout/TheFooter.vue';
import TheHeader from '~/layout/TheHeader.vue';
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <TheHeader />
        <MainLoginView />
        <TheFooter />
    </div>
</template>
