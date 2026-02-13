<template>
    <div class="max-w-screen z-1000 top-0 left-0 w-full sticky">
        <div class="flex flex-col h-full w-full top-0 left-0  shadow shadow-white">
            <section class="flex px-20 py-1 gap-4 text-[10px] bg-[#343532] font-extralight text-white">
                <h3 class="">(XX)-9XXXX-XXXX</h3>
                <h3>test@email.com</h3>
            </section>
            <header class="h-full bg-white px-20 flex flex-1 justify-between items-center">
                <div class="h-full flex items-center">
                    <div class="flex flex-col justify-center items-center max-h-max max-w-min">
                        <h2 class="font-[Roboto Mono] tracking-[10px] font-thin text-2xl text-black">Três</h2>
                        <h2 class="font-[Roboto Mono] tracking-[10px] font-thin text-2xl text-[#8b56a5]">amigos</h2>
                    </div>
                </div>
                <!-- <ul class="flex justify-center gap-8 font-light *:content-center">
                        <li class="hover-effect-7">
                            <router-link to="/">
                                Página Inicial
                            </router-link>
                        </li>
                        <li class="hover-effect-7">
                            <Button>
                                Quartos
                            </Button>
                        </li>
                        <li class="hover-effect-7">Contate-nos</li>
                        <li class="hover-effect-7">Sobre nós</li>
                        <li class="hover-effect-7">Avaliações</li>
                    </ul> -->
                <NavigationMenu >
                    <NavigationMenuList class="flex justify-center items-center gap-12">
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
                            <NuxtLink to="/LoginView">Login</NuxtLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </header>
        </div>
    </div>
</template>

<script setup>

import Button from '@/components/ui/button/Button.vue';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from '@/components/ui/navigation-menu'


</script>
