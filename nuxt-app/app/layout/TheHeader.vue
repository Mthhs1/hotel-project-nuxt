<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"
/*import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu" */

import Switch from "~/components/ui/switch/Switch.vue"

// 1. Chamamos o módulo do Nuxt para descobrir qual é o tema atual
const colorMode = useColorMode()

/*const isDark = computed({
    // O GET: Lê o Nuxt e traduz para o Botão
    // Quando a página carregar, o botão pergunta: "Devo ficar ligado?"
    get() {
        // Se o Nuxt estiver no dark, responde "true" (liga o botão). Se não, "false".
        return colorMode.preference === "dark"
    },

    // O SET: Lê o Botão e traduz para o Nuxt
    // Quando o usuário clica, o botão envia o novo estado dele (newValue = true ou false)
    set(newValue) {
        // Se o botão ficou true, avisamos o Nuxt para mudar para 'dark'.
        // Se ficou false, avisamos para ir para 'light'.
        colorMode.preference = newValue ? "dark" : "light"
    },
})*/
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
    <div class="border-white border-b h-full flex flex-col sticky top-0 left-0 z-1000">
        <section
            class="flex px-20 py-1 gap-4 text-[10px] bg-[#343532] font-extralight text-inverted dark:text-[#899AB2]">
            <h3 class="">
                (XX)-9XXXX-XXXX
            </h3>
            <h3>test@email.com</h3>
        </section>
        <UHeader class="flex-1" title="Tres Amigos">
            <template #title>
                <h1 class="font-[Montserrat] font-light tracking-widest">
                    Três Amigos
                </h1>
            </template>

            <UNavigationMenu :ui="{ link: 'text-md', list: 'gap-12' }" content-orientation="vertical" :items="items" />

            <template #right>
                <UColorModeButton />
                <UButton to="/login" size="xl" class="flex justify-center rounded-none h-full shadow-xs shadow-black/50">
                    Login
                </UButton>
            </template>
        </UHeader>
    </div>
</template>