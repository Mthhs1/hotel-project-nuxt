<script setup lang="ts">
import LoginForm from "./LoginForm.vue"
</script>

<template>
    <UMain>
        <div class="flex min-h-screen *:flex-1">
            <div class="bg-[url('~/assets/images/LoginView/LoginMain.jpg')] bg-cover bg-center bg-no-repeat relative">
                <div class="absolute inset-0 backdrop-blur-[2px]">
                </div>
                <div class="relative z-10 flex flex-col items-center gap-8 text-white p-4">
                </div>
            </div>
            <div class="flex flex-col items-center justify-center">
                <UCard variant="subtle" class="w-80 h-120 p-4">
                    <template #header>
                        <h2 class="text-start text-2xl font-bold font-[Roboto] tracking-widest">
                            Login
                        </h2>
                    </template>
                    <template #default>
                        <LoginForm />
                    </template>
                    <template #footer>
                        <div />
                    </template>
                </UCard>
            </div>
            <!-- <UContainer class="flex-1 h-full">2</UContainer>
            <UContainer class="flex-1">1</UContainer> -->
        </div>
    </UMain>
</template>
