<script setup lang="ts">
import RegisterForm from "./RegisterForm.vue"
</script>

<template>
    <UMain
        class="flex bg-linear-to-r from-[#2A7B9B]/30 via-[#57C785]-30 to-[#EDDD53]/30"
    >
        <div class="mx-4 mt-4 mb-8 flex flex-1">
            <div class="flex flex-1 *:flex-1 relative">
                <div
                    class="bg-[url('~/assets/images/LoginView/LoginMain.jpg')] bg-cover bg-center bg-no-repeat relative rounded-xl"
                >
                    <!-- <div class="absolute inset-0 backdrop-blur-[2px]" /> -->
                    <div
                        class="relative z-10 flex flex-col items-center gap-8 text-white p-4"
                    />
                </div>
                <div class="flex flex-col items-center justify-center">
                    <UCard variant="soft" class="w-86 h-auto p-4">
                        <template #header>
                            <h2
                                class="text-start text-2xl font-bold font-[Roboto] flex justify-center tracking-widest"
                            >
                                Registro
                            </h2>
                        </template>
                        <template #default>
                            <RegisterForm />
                        </template>
                    </UCard>
                </div>
            </div>
        </div>
    </UMain>
</template>
