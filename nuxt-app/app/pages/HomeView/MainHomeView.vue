<script setup lang="ts">
const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true
})

const carouselItems = [
    "/images/HomeView/HomeViewCarousel/1.jpg",
    "/images/HomeView/HomeViewCarousel/2.jpg",
    "/images/HomeView/HomeViewCarousel/3.jpg",
    "/images/HomeView/HomeViewCarousel/4.jpg",
    "/images/HomeView/HomeViewCarousel/5.jpg",
]
</script>

<template>
    <UMain>
        <!-- Row 1 -->
        <div class="w-full min-h-screen relative flex flex-col gap-8 items-center justify-center p-4">
            <div
                class="absolute top-0 left-0 -z-1 h-full w-full bg-cover blur-[1px] brightness-70 bg-center bg-no-repeat bg-[url('~/assets/images/HomeView/HomeViewBackGround.jpg')]"
            />
            <div class="relative z-1 text-5xl font-extralight">
                <h2 class="uppercase text-white">
                    Bem vindo ao Hotel Três Amigos
                </h2>
            </div>
            <USeparator class="w-[70%]" />

            <div class="flex relative text-white gap-12 items-center justify-center text-l max-w-sceen *:flex-1 w-96">
                <UButton
                    trailing-icon="tabler:arrow-narrow-right" :ui="{ base: 'hover:bg-[#97753d]' }" size="xl"
                    color="secondary" variant="soft" class="rounded-none flex justify-center shadow-black/10 shadow-sm"
                >
                    FAÇA UM TOUR
                </UButton>
                <UButton
                    trailing-icon="tabler:arrow-narrow-right" :ui="{ base: 'hover:bg-[#97753d] dark:shadow-white/10' }" size="xl"
                    color="secondary" variant="soft" class="rounded-none flex justify-center shadow-black/10 shadow-sm"
                >
                    ENTRAR
                </UButton>

                <!-- <button
                    class="border-white border hover:shadow-xs hover:shadow-white hover:bg-[#bad1cd] uppercase p-2 rounded w-46 transition-all delay-100"
                >
                    Faça um tour →
                </button>
                <button
                    class="border-white border hover:shadow-xs hover:shadow-white hover:bg-[#bad1cd] uppercase p-2 rounded w-46 transition-all delay-100"
                >
                    Entrar →
                </button> -->
            </div>
        </div>

        <!-- Row 2 -->
        <div class="w-full min-h-26 -mt-8 relative flex justify-center max-w-screen">
            <div class="flex bg-[#343532] text-white w-2xl justify-center items-center *:flex-1 *:text-center shadow">
                <div>
                    <h2>Check-in</h2>
                    <div><i class="fa fa-calendar" aria-hidden="true" /></div>
                </div>
                <div>
                    <h2>Garagem</h2>
                    <div><i class="fa fa-car" aria-hidden="true" /></div>
                </div>
                <div>
                    <h2>Quarto</h2>
                    <div><i class="fa fa-building" aria-hidden="true" /></div>
                </div>
                <div>
                    <h2>Pessoas</h2>
                    <div><i class="fa fa-user" aria-hidden="true" /></div>
                </div>
                <div class="bg-[#f2d1c9] h-full w-full flex flex-col justify-center *:font-bold">
                    <h2>Cheque</h2>
                    <h2 class="-mt-1" />Disponibilidade
                </div>
            </div>
        </div>

        <!-- Row 3  -->
        <div class="my-8 text-3xl font-light tracking-wide flex justify-center">
            <h1>
                Nossas acomodações para voce!
            </h1>
        </div>

        <!-- Row 4 -->
        <div class="h-96 my-8">
            <UCarousel
                v-slot="{ item }" :arrows="isMounted" dots loop :items="carouselItems"
                class="h-full max-w-3xl mx-auto"
            >
                <img :src="item" class="w-full h-96 object-cover rounded-lg" draggable="false">
            </UCarousel>
        </div>
    </UMain>
</template>
