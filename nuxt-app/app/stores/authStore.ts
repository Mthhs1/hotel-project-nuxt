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
    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLogged = ref(false)
    const isLoadingPage = ref(true)

    const GETisLoadingSignIn = computed(() => isLoadingSignIn.value)
    const GETisLoadingPage = computed(() => isLoadingPage.value)
    const GETisLoadingSignUp = computed(() => isLoadingSignUp.value)
    const GETisLogged = computed(() => isLogged.value)

    async function handleSignUp(credentials: User) {
        isLoadingSignUp.value = true

        let response

        try {
            response = await $fetch("/api/signup", {
                method: "POST",
                body: credentials,
            })
        } catch (error) {
            console.log(error)
            isLoadingSignUp.value = false
            return error
        }

        isLoadingSignUp.value = false

        console.log(response)
        return response
    }

    async function handleSignIn(credentials: User) {
        isLoadingSignIn.value = true

        let response
        try {
            response = await $fetch("/api/signin", {
                method: "POST",
                body: credentials,
            })

            isLogged.value = true
        } catch (error) {
            console.log(error)
            isLoadingSignIn.value = false
            return error
        }

        isLoadingSignIn.value = false

        return response
    }

    async function handleLogout() {
        let response
        
        try {
            response = await $fetch("/api/logout", {
                method: "POST",
                body: {},
            })
            isLogged.value = false
        } catch (error) {
            console.log(error)
        }
        console.log(response)

        return response
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

        isLoadingPage.value = false
    }

    return {
        GETisLoadingSignIn,
        GETisLoadingSignUp,
        GETisLoadingPage,
        GETisLogged,
        handleSignUp,
        handleSignIn,
        handleLogout,
        checkAuth,
    }
})
