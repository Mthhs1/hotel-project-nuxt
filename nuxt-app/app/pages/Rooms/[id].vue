<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const carouselItems: string[] = reactive([])

const numberOfImages = 5
const mapIdToRooms = ["Quarto Luxuoso", "Quarto Padrão", "Quarto Classe Alta"]

const idPageStr = route.params.id
const idPageIndex = Number(idPageStr)
const quarto = mapIdToRooms[idPageIndex - 1]

if (idPageIndex < 1 || idPageIndex > 4) {
    router.push("/")
}

let response

try {
    response = await useFetch("/api/rooms/room", {
        method: "GET",
        query: { quarto },
    })

    for (let i = 2; i < numberOfImages + 1; i++) {
        carouselItems.push(response.data.value?.url + `${i}.jpg`)
    }
} catch (error) {
    console.log(error)
}

const data = response?.data
</script>

<template>
    <div>
        <UMain class="flex flex-col gap-4">
            <!-- Row 1 -->
            <div class="relative flex flex-col h-128">
                <div
                    class="w-full h-full relative flex flex-col gap-8 items-center justify-center p-4 flex-1"
                >
                    <div
                        class="absolute top-0 left-0 -z-1 h-full w-full bg-cover blur-[.6px] brightness-70 bg-center bg-no-repeat"
                        :style="{ backgroundImage: `url('${data?.url}1.jpg')` }"
                    />
                    <div class="relative z-1 text-6xl font-extralight">
                        <h2
                            class="text-white text-center font-[Quintessential] font-extralight text-shadow-lg text-shadow-white/20"
                        >
                            {{ data?.roomType }}
                        </h2>
                    </div>

                    <USeparator
                        class="w-xs md:w-md lg:w-lg"
                        color="neutral"
                        size="xs"
                    />
                </div>
            </div>

            <!-- Row 2 -->
            <div class="flex-1 h-auto">
                <UCarousel
                    v-slot="{ item }"
                    dots
                    :items="carouselItems"
                    class="w-ful"
                    :ui="{ item: 'basis-full sm:basis-1/2 md:basis-1/3' }"
                >
                    <div class="flex justify-center items-center">
                        <img
                            :src="item"
                            class="w-auto h-64 rounded"
                            draggable="false"
                        />
                    </div>
                </UCarousel>
            </div>

            <!-- Row 3 -->
            <div class="h-128 relative p-12">
                <UCard class="h-full"> a </UCard>
            </div>
        </UMain>
    </div>
</template>
