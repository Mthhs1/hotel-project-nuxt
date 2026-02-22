/* eslint-disable style/brace-style */
/* eslint-disable no-console */
import { defineStore } from "pinia"

interface User {
    email: string | undefined
    birthDay: number | undefined
    password: string | undefined
    name: string | undefined
}

export const useAuthStore = defineStore("authStore", () => {
    const isLoading = ref(false)
    const isLogged = ref(false)

    const GETisLoading = computed(() => isLoading.value)
    const GETisLogged = computed(() => isLogged.value)

    async function handleSignUp(credentials: User) {
        isLoading.value = true

        console.log("credentials")
        console.log(credentials)

        const data = await $fetch("/api/signup", {
            method: "POST",
            body: credentials,
        })

        isLoading.value = false
        return data
    }

    async function handleSignIn(credentials: User) {
        isLoading.value = true

        const data = await $fetch("/api/signin", {
            method: "POST",
            body: credentials,
        })

        isLoading.value = false
        isLogged.value = true

        return data
    }

    async function handleLogout(): Promise<void> {
        try {
            console.log("Iniciado processo logout")

            await $fetch("/api/logout", {
                method: "POST",
                body: {},
            })

            console.log("Aqui!")
            isLogged.value = false
        } catch (error) {
            console.log(error)
        }
    }

    async function checkAuth() {
        try {
            const res = await $fetch("/api/checkauth")
            if (res) {
                isLogged.value = true
            }
        } catch (err) {
            console.log(err)
        }

        return null
    }

    return {
        GETisLoading,
        GETisLogged,
        handleSignUp,
        handleSignIn,
        handleLogout,
        checkAuth,
    }
})
