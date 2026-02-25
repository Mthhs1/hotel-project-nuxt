import type { RefSymbol } from "@vue/reactivity"
import { defineStore } from "pinia"
import { authClient } from "~/lib/auth-client"

interface User {
    email: string | undefined
    birthDay: number | undefined
    password: string | undefined
    name: string | undefined
}

export const useAuthStore = defineStore("authStore", () => {
    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLoadingPage = ref(true)

    const session = authClient.useSession()

    const GETisLoadingSignIn = computed(() => isLoadingSignIn.value)
    const GETisLoadingPage = computed(
        () =>
            isLoadingPage.value ||
            session.value.isPending ||
            session.value.isRefetching,
    )
    const GETisLoadingSignUp = computed(() => isLoadingSignUp.value)
    const GETisLogged = computed(() => session.value.data?.session)
    const GETUser = computed(() => session.value.data?.user)

    function SETisLoadingPage(value: boolean) {
        isLoadingPage.value = value
    }

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
        } catch (error) {
            isLoadingSignIn.value = false
            return error
        }

        await session.value.refetch()
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
            console.log(session.value.data?.session)
        } catch (error) {
            console.log(error)
        }

        await session.value.refetch()
        return response
    }

    /*async function checkAuth() {
        try {
            const res = await $fetch("/api/checkauth")
            if (res) {
                isLogged.value = true
            }
        } catch (err) {
            console.log(err)
        }

        isLoadingPage.value = false
    }*/

    return {
        GETisLoadingSignIn,
        GETisLoadingSignUp,
        GETisLoadingPage,
        GETisLogged,
        GETUser,
        SETisLoadingPage,
        handleSignUp,
        handleSignIn,
        handleLogout,
        // checkAuth,
    }
})
