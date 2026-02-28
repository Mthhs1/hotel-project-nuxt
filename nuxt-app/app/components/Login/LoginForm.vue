<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
import { useAuthStore } from "~/stores/authStore"

const authStore = useAuthStore()
const showPass = ref(false)

const schema = z.object({
    email: z.email("Email inválido"),

    password: z
        .string("Senha requerida.")
        .min(8, "Sua senha deve ter pelo menos 6 caracteres"),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    toast.add({
        title: "Successo!",
        description: "Sua tentativa de login foi enviada.",
        color: "success",
        duration: 1000,
    })

    const credentials = {
        email: event.data.email,
        password: event.data.password,
    }

    let response

    try {
        response = await authStore.handleSignIn(credentials)
    } catch (err) {
        console.log(err)
    }

    if (response && response.status >= 400 && response.status <= 500) {
        if (
            response.data.message &&
            response.data.message === "Invalid email or password"
        ) {
            toast.add({
                title: "Erro no Login!",
                description: "Email ou Senha inválida!",
                color: "error",
                duration: 3000,
            })
        }
    }

    if (response && response.user) {
        toast.add({
            title: "Login bem-sucedido!",
            description: "Você entrou com sucesso.",
            color: "success",
            duration: 3000,
        })
        await navigateTo("/")
    }
}
</script>

<template>
    <div>
        <UForm
            :disabled="authStore.GETisLoadingSignIn"
            :schema="schema"
            class="flex flex-col gap-4 justify-center items-center"
            :state="state"
            @submit="onSubmit"
        >
            <UContainer>
                <UFormField
                    :ui="{ error: 'text-[.7rem]' }"
                    size="xs"
                    label="Email"
                    name="email"
                >
                    <UInput
                        v-model="state.email"
                        :ui="{ base: 'bg-white/50' }"
                        variant="soft"
                        class="w-full"
                        type="text"
                    />
                </UFormField>
            </UContainer>

            <UContainer>
                <UFormField
                    :ui="{ error: 'text-[.7rem]' }"
                    size="xs"
                    label="Senha"
                    name="password"
                >
                    <UInput
                        v-model="state.password"
                        :ui="{ base: 'bg-white/50' }"
                        variant="soft"
                        class="w-full"
                        :type="showPass ? 'text' : 'password'"
                    >
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="xl"
                                :icon="
                                    showPass
                                        ? 'i-lucide-eye-off'
                                        : 'i-lucide-eye'
                                "
                                :aria-label="
                                    showPass ? 'Hide password' : 'Show password'
                                "
                                :aria-pressed="showPass"
                                aria-controls="password"
                                @click="showPass = !showPass"
                            />
                        </template>
                    </UInput>
                </UFormField>
            </UContainer>
            <USeparator />
            <UButton
                :loading="authStore.GETisLoadingSignIn"
                :disabled="authStore.GETisLoadingSignIn"
                label="Entrar"
                type="submit"
                class="flex justify-center w-[40%]"
            />
        </UForm>
    </div>
</template>
