// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: [
        "@nuxt/eslint",
        "@nuxt/fonts",
        "@nuxt/icon",
        "@nuxtjs/tailwindcss",
        "@vueuse/nuxt",
        "shadcn-nuxt",
        "@nuxtjs/color-mode",
        "@nuxt/ui",
    ],
    shadcn: {
        /**
         * Prefix for all the imported component.
         * @default "Ui"
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * Will respect the Nuxt aliases.
         * @link https://nuxt.com/docs/api/nuxt-config#alias
         * @default "@/components/ui"
         */
        componentDir: "@/components/ui",
    },
    eslint: {
        config: {
            standalone: false,
        },
    },
    colorMode: {
        classSuffix: "",
    },
})
