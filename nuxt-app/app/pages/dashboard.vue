<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const visible = ref(false)

const items: NavigationMenuItem[][] = [
    [
        {
            label: "Home",
            icon: "i-lucide-house",
            to: "/",
        },
        {
            label: "Reserva",
            defaultOpen: true,
            icon: "i-lucide-inbox",
            to: "/dashboard/reservation",
            children: [
                {
                    label: "Ver minhas reservas",
                    to: "/dashboard/reservation/my",
                },
                {
                    label: "Fazer uma reserva",
                    to: "/dashboard/reservation/list",
                },
            ],
        },
        {
            label: "Meus Dados",
            icon: "i-lucide-users",
        },
        {
            label: "Settings",
            icon: "i-lucide-settings",
            defaultOpen: false,
            children: [
                {
                    label: "General",
                },
                {
                    label: "Members",
                },
                {
                    label: "Notifications",
                },
                {
                    label: "Notifications",
                },
            ],
        },
    ],
    [
        {
            label: "Feedback",
            icon: "i-lucide-message-circle",
            to: "https://github.com/nuxt-ui-templates/dashboard",
            target: "_blank",
        },
        {
            label: "Help & Support",
            icon: "i-lucide-info",
            to: "https://github.com/nuxt/ui",
            target: "_blank",
        },
    ],
]
</script>

<template>
    <div
        class="flex flex-col md:flex-row gap-6 w-full  mx-auto p-4 md:p-8 flex-1"
    >
        <aside
            class="w-full md:w-64 shrink-0 flex flex-col gap-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900"
        >
            <div class="flex items-center justify-center p-2 mb-2">
                <UIcon
                    name="i-simple-icons-nuxtdotjs"
                    class="size-6 text-primary"
                />
            </div>

            <UButton
                label="Search..."
                icon="i-lucide-search"
                color="neutral"
                variant="outline"
                block
            >
                <template #trailing>
                    <div class="flex items-center gap-0.5 ms-auto">
                        <UKbd value="meta" variant="subtle" />
                        <UKbd value="K" variant="subtle" />
                    </div>
                </template>
            </UButton>

            <UNavigationMenu :items="items[0]" orientation="vertical" />

            <div class="flex-1 min-h-10"></div>

            <UNavigationMenu
                :items="items[1]"
                orientation="vertical"
                class="mt-auto"
            />

            <div
                class="border-t border-gray-200 dark:border-gray-800 pt-4 mt-2"
            >
                <UButton
                    label="Benjamin"
                    color="neutral"
                    variant="ghost"
                    class="w-full justify-start"
                />
            </div>
        </aside>

        <main
            class="relative flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800 p-6"
        >
            <NuxtPage class=""/>
        </main>
    </div>
</template>
