<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const schema = z.object({
    name: z
        .string("Seu nome deve conter ao menos 1 caractere")
        .min(1, "Seu nome deve conter ao menos 1 caractere")
        .max(20, "Seu nome deve conter no máximo 20 caracteres"),

    email: z.email("Email inválido"),

    password: z
        .string("Senha requerida.")
        .min(6, "Sua senha deve ter pelo menos 6 caracteres"),

    birthday: z.coerce
        .date("Data inválida")
        .min(new Date(1950, 1, 1), "Data muito antiga.")
        .max(Date.now(), "Data inserida no futuro."),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    name: undefined,
    birthday: undefined,
})

const toast = useToast()

/*
O usuário clica em enviar.

O <UForm> pega o objeto state (que está ligado aos inputs).

A Validação Automática: O <UForm> pega esse state e joga dentro do seu schema do Zod para testar.

Se falhar: O Zod avisa o <UForm> que tem erro (ex: a senha tem menos de 6 caracteres). O <UForm> bloqueia o envio,
mostra as mensagens de erro em vermelho na tela automaticamente, e a sua função onSubmit nem chega a ser chamada.

Se passar (Sucesso): O Zod confirma que está tudo perfeito. O <UForm> então chama a sua função onSubmit e entrega o event.
*/
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
            class="flex flex-col gap-2 justify-center items-center transition-all duration-75 ease-in-out"
            :state="state"
            :schema="schema"
            @submit="onSubmit"
        >
            <UContainer>
                <UFormField
                    :ui="{ error: 'text-[.7rem]' }"
                    size="xs"
                    label="Nome"
                    name="name"
                >
                    <UInput
                        v-model="state.name"
                        :ui="{ base: 'bg-white/50' }"
                        variant="soft"
                        type="text"
                        class="w-full"
                    />
                </UFormField>
            </UContainer>

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
                        type="text"
                        class="w-full"
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
                        type="password"
                        variant="soft"
                        class="w-full"
                    />
                </UFormField>
            </UContainer>

            <UContainer>
                <UFormField
                    :ui="{ error: 'text-[.7rem]' }"
                    size="xs"
                    label="Data de Nascimento"
                    name="birthday"
                >
                    <UInputDate
                        v-model="state.birthday"
                        class="w-full"
                        variant="soft"
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
