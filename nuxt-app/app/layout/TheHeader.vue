<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui"
import { useAuthStore } from "~/stores/authStore"

const authStore = useAuthStore()
const toast = useToast()

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: "Pagina Inicial",
        to: "/",
    },
    {
        label: "Quartos",
        children: [
            {
                label: "Quarto Luxuoso",
                to: "/rooms/1",
            },
            {
                label: "Quarto Padrão",
                to: "/rooms/2",
            },
            {
                label: "Quarto Classe Alta",
                to: "/rooms/3",
            },
        ],
    },
    {
        label: "Contate nos",
    },
    {
        label: "Sobre nós",
    },
])

const itemsDropdown = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Configurações",
            icon: "tabler:settings",
        },
    ],
    [
        {
            label: "Logout",
            icon: "tabler:logout",
            onSelect: async () => {
                toast.add({
                    title: "Logout",
                    description: "Sua solicitação de logout foi enviada.",
                    color: "success",
                    duration: 2000,
                })
                const response = await authStore.handleLogout()

                if (response && response.success === true) {
                    toast.add({
                        title: "Logout bem-sucedido!",
                        description: "Você saiu com sucesso.",
                        color: "success",
                        duration: 3000,
                    })

                    await navigateTo("/")
                } else {
                    toast.add({
                        title: "Erro no Logout!",
                        description: "Ocorreu um erro ao tentar sair.",
                        color: "error",
                        duration: 3000,
                    })
                }
            },
        },
    ],
])
</script>

<template>
    <UHeader
        :ui="{ root: 'border-none' }"
        title="Tres Amigos"
        class="h-20 flex flex-col sticky top-0 left-0 z-1000"
    >
        <template #top>
            <section
                class="flex px-20 py-1 gap-4 text-[10px] bg-[#343532] font-extralight text-inverted dark:text-[#899AB2]"
            >
                <h3>(XX)-9XXXX-XXXX</h3>
                <h3>test@email.com</h3>
            </section>
        </template>

        <template #title>
            <h1 class="font-[Montserrat] font-light tracking-widest">
                Três Amigos
            </h1>
        </template>

        <UNavigationMenu
            :ui="{
                link: 'text-sm',
                list: 'gap-12',
                childLink: 'items-center justify-center',
                content: 'w-auto',
            }"
            content-orientation="vertical"
            :items="items"
        />

        <template #right>
            <UColorModeButton />

            <UButton
                v-if="!authStore.GETisLogged"
                :loading="
                    authStore.GETisLoadingSignIn || authStore.GETisLoadingSignUp
                "
                trailing-icon="tabler:login-2"
                to="/login"
                size="xl"
                class="bg-[#3d3c38] dark:bg-white w-28 flex justify-center rounded-sm h-full shadow-xs shadow-black/50 mx-4"
            >
                LOGIN
            </UButton>

            <UDropdownMenu v-else :items="itemsDropdown">
                <UButton size="xl" icon="tabler:user" />
            </UDropdownMenu>
        </template>
    </UHeader>
</template>
