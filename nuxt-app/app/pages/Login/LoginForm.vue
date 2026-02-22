<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
import { useAuthStore } from "~/stores/authStore"

const authStore = useAuthStore()

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
        title: "Success",
        description: "The form has been submitted.",
        color: "success",
        duration: 1000,
    })
    console.log(event.data)

    const credentials = {
        email: state.email,
        password: state.password,
        birthDay: undefined,
        name: undefined,
    }

    console.log(credentials)

    const data = await authStore.handleSignIn(credentials)

    console.log(data)
}
</script>

<template>
    <div>
        <UForm
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
                        type="password"
                    />
                </UFormField>
            </UContainer>
            <USeparator />
            <UButton
                label="Entrar"
                type="submit"
                class="flex justify-center w-[40%]"
            />
        </UForm>
    </div>
</template>
