<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const items = computed<NavigationMenuItem[]>(() => [
    {
        label: "Pagina Inicial",
        to: "/",
    },
    {
        label: "Quartos",
        children: [
            {
                label: "Quarto 1",
            },
            {
                label: "Quarto 2",
            },
            {
                label: "Quarto 3",
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
</script>

<template>
    <UHeader title="Tres Amigos" class="border-white border-b h-20 flex flex-col sticky top-0 left-0 z-1000">
        <template #top>
            <section
                class="flex px-20 py-1 gap-4 text-[10px] bg-[#343532] font-extralight text-inverted dark:text-[#899AB2]"
            >
                <h3>
                    (XX)-9XXXX-XXXX
                </h3>
                <h3>test@email.com</h3>
            </section>
        </template>

        <template #title>
            <h1 class="font-[Montserrat] font-light tracking-widest">
                Três Amigos
            </h1>
        </template>

        <UNavigationMenu :ui="{ link: 'text-md', list: 'gap-12' }" content-orientation="vertical" :items="items" />

        <template #right>
            <UColorModeButton />
            <UButton trailing-icon="tabler:login-2" to="/login" size="xl" class="w-28 flex justify-center rounded-none h-full shadow-xs shadow-black/50 mx-4">
                LOGIN
            </UButton>
        </template>
    </UHeader>
</template>
