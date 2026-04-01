// https://nuxt.com/docs/api/configuration/nuxt-config
import env from "./app/lib/env"

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: [
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxtjs/tailwindcss",
        "@nuxt/ui",
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "@nuxtjs/color-mode",
    ],
    pinia: {
        /**
         * Automatically add stores dirs to the auto imports. This is the same as
         * directly adding the dirs to the `imports.dirs` option. If you want to
         * also import nested stores, you can use the glob pattern `./stores/**`
         * (on Nuxt 3) or `app/stores/**` (on Nuxt 4+)
         *
         * @default `['stores']`
         */
        storesDirs: [],
    },
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        classSuffix: "",
    },
    app: {
        pageTransition: {
            name: "page",
            mode: "out-in",
        },
    },
    nitro: {
        experimental: {
            tasks: true,
        },
        scheduledTasks: {
            "*/15 * * * *": ["cleanPendingReservations"], // Run every 5 minutes
        }
    },
    devtools: {
        enabled: false, // or false to disable
    },
    runtimeConfig: {
        // Public keys that are exposed to the client
        public: {
            BETTER_AUTH_URL: env.BETTER_AUTH_URL,
        },
    },
})
