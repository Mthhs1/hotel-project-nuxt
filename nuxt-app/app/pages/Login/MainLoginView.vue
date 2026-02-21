<script setup lang="ts">
import LoginForm from "./LoginForm.vue"
</script>

<template>
    <UMain>
        <div class="flex min-h-screen *:flex-1">
            <div class="bg-[url('~/assets/images/LoginView/LoginMain.jpg')] bg-cover bg-center bg-no-repeat relative">
                <div class="absolute inset-0 backdrop-blur-[2px]" />
                <div class="relative z-10 flex flex-col items-center gap-8 text-white p-4" />
            </div>
            <div class="flex flex-col items-center justify-center">
                <UCard variant="subtle" class="w-80 h-96 p-4">
                    <template #header>
                        <h2 class="text-start text-2xl font-bold font-[Roboto] flex justify-center tracking-widest">
                            Login
                        </h2>
                    </template>
                    <template #default>
                        <LoginForm />
                    </template>

                    <template #footer>
                        <div class="flex justify-center">
                            <h5>
                                Sem conta?
                                <ULink to="/register">
                                    Registre-se!
                                </ULink>
                            </h5>
                        </div>
                    </template>
                </UCard>
            </div>
        </div>
    </UMain>
</template>
