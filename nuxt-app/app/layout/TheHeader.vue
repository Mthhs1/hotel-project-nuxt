<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import Switch from "~/components/ui/switch/Switch.vue"

// 1. Chamamos o módulo do Nuxt para descobrir qual é o tema atual
const colorMode = useColorMode()

const isDark = computed({

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
})
</script>

<template>
    <div class="max-w-screen z-1000 top-0 left-0 w-full sticky">
        <div class="flex flex-col h-full w-full top-0 left-0  shadow shadow-white">
            <section class="flex px-20 py-1 gap-4 text-[10px] bg-[#343532] font-extralight">
                <h3 class="">
                    (XX)-9XXXX-XXXX
                </h3>
                <h3>test@email.com</h3>
            </section>
            <header class="h-full bg-[#e6e6e6] px-20 flex flex-1 justify-between items-center">
                <div class="h-full flex items-center">
                    <div class="flex flex-col justify-center items-center max-h-max max-w-min">
                        <h2 class="font-[Roboto Mono] tracking-[10px] font-thin text-2xl text-black">
                            Três
                        </h2>
                        <h2 class="font-[Roboto Mono] tracking-[10px] font-thin text-2xl text-[#8b56a5]">
                            amigos
                        </h2>
                    </div>
                </div>
                <NavigationMenu>
                    <NavigationMenuList class="flex justify-center items-center gap-12">
                        <NavigationMenuItem class="flex justify-center items-center gap-4">
                            <Switch v-model="isDark" />
                            <Icon name="tabler:moon-filled" />
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            Pagina Inicial
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Quartos</NavigationMenuTrigger>
                            <NavigationMenuContent class="w-48">
                                <NavigationMenuLink>Quarto 1</NavigationMenuLink>
                                <NavigationMenuLink>Quarto 2</NavigationMenuLink>
                                <NavigationMenuLink>Quarto 3</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            Contate-nos
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            Sobre nós
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NuxtLink to="/LoginView" />Login
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </header>
        </div>
    </div>
</template>
