<script>

import { ref } from 'vue'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'

</script>

<template>
    <main class="grid grid-cols-1 relative">

        <!-- Row 1 -->
        <div class="w-full min-h-screen relative flex flex-col gap-8 items-center justify-center p-4">
            <div
                class="absolute top-0 left-0 -z-1 h-full w-full bg-cover blur-[1px] brightness-70 bg-center bg-no-repeat bg-[url('~/assets/images/HomeView/HomeViewBackGround.jpg')]">
            </div>
            <div class="relative z-1 text-5xl font-extralight">
                <h2 class="uppercase text-white border-b">Bem vindo ao Hotel Três Amigos</h2>
            </div>
            <div class="flex relative text-white gap-12 items-center justify-center text-l max-w-sceen">
                <button
                    class="border-white border hover:shadow-xs hover:shadow-white hover:bg-[#bad1cd] uppercase p-2 rounded w-46 transition-all delay-100">
                    Faça um tour →
                </button>
                <button
                    class="border-white border hover:shadow-xs hover:shadow-white hover:bg-[#bad1cd] uppercase p-2 rounded w-46 transition-all delay-100">
                    Entrar →
                </button>
            </div>
        </div>

        <!-- Row 2 -->
        <div class="w-full min-h-26 -mt-8 relative flex justify-center max-w-screen">
            <div class="flex bg-[#343532] text-white w-2xl justify-center items-center *:flex-1 *:text-center shadow">
                <div>
                    <h2>Check-in</h2>
                    <div><i class="fa fa-calendar" aria-hidden="true"></i></div>
                </div>
                <div>
                    <h2>Garagem</h2>
                    <div><i class="fa fa-car" aria-hidden="true"></i></div>
                </div>
                <div>
                    <h2>Quarto</h2>
                    <div><i class="fa fa-building" aria-hidden="true"></i></div>
                </div>
                <div>
                    <h2>Pessoas</h2>
                    <div><i class="fa fa-user" aria-hidden="true"></i></div>
                </div>
                <div class="bg-[#f2d1c9] h-full w-full flex flex-col justify-center *:font-bold">
                    <h2>Cheque</h2>
                    <h2 class="-mt-1">Disponibilidade</h2>
                </div>
            </div>
        </div>

        <!-- Row 3  -->
        <div class="mt-8 text-3xl font-light tracking-wide flex justify-center">
            <h1>
                Nossas acomodações para voce!
            </h1>
        </div>

        <!-- Row 4 -->
        <div class="w-full flex justify-center items-center mt-12">
            <Carousel class="w-[80%]">
                <CarouselContent>
                    <CarouselItem class="w-full flex justify-center" v-for="i in 5" :key="i">
                        <div class="w-[80%] h-80 md:h-137 overflow-hidden rounded-xl shadow-lg">
                            <img class="w-full h-full object-cover" :src="`/images/HomeView/HomeViewCarousel/${i}.jpg`">
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <ClientOnly>
                    <CarouselPrevious />
                    <CarouselNext />
                </ClientOnly>   
            </Carousel>
        </div>
    </main>
</template>
