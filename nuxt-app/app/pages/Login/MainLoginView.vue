<script setup lang="ts">
import LoginForm from "./LoginForm.vue"
</script>

<template>
    <div>
        <UMain
            class="flex bg-linear-to-r from-[#2A7B9B]/30 via-[#57C785]-30 to-[#EDDD53]/30"
        >
            <div class="mx-4 mt-4 mb-8 flex flex-1">
                <div class="flex flex-1 *:flex-1 relative">
                    <div class="flex flex-col items-center justify-center">
                        <UCard variant="soft" class="w-auto h-auto p-4">
                            <template #header>
                                <div class="flex flex-col gap-2">
                                    <h2
                                        class="text-start text-2xl font-bold font-[Roboto] flex justify-center tracking-widest"
                                    >
                                        Faça login na sua conta!
                                    </h2>
                                    <h5
                                        class="text-gray-500 text-start text-xs font-bold font-[Roboto] flex justify-center tracking-widest"
                                    >
                                        Acesse com as suas redes sociais!
                                    </h5>
                                    <div class="flex justify-center">
                                        <UButton icon="tabler:brand-google-filled">Google</UButton>
                                    </div>
                                    <USeparator class="w-auto min-w-sm" color="primary" label="Ou"/>
                                </div>
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

                    <div
                        class="bg-[url('~/assets/images/LoginView/LoginMain.jpg')] bg-cover bg-center bg-no-repeat relative rounded-xl"
                    >
                        <div
                            class="absolute inset-0 rounded-xl flex flex-col items-center justify-start gap-4 p-8"
                        >
                        </div>
                    </div>
                </div>
            </div>
        </UMain>
    </div>
</template>
