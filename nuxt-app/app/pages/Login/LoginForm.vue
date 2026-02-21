<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const schema = z.object({
    email: z.email("Invalid email"),
    password: z
        .string("Password is required")
        .min(6, "Must be at least 8 characters"),
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
    })
    // eslint-disable-next-line no-console
    console.log(event.data)
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
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" type="text" />
                </UFormField>
            </UContainer>

            <UContainer>
                <UFormField label="Senha" name="password">
                    <UInput v-model="state.password" type="password" />
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
