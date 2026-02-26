import { defineStore } from "pinia"
import { authClient } from "~/lib/auth-client"

interface User {
    email: string | undefined
    birthDay: number | undefined
    password: string | undefined
    name: string | undefined
}

export const useAuthStore = defineStore("authStore", () => {
    const session = ref<Awaited<
        ReturnType<typeof authClient.useSession>
    > | null>(null)

    async function init() {
        const data = await authClient.useSession(useFetch)
        session.value = data
    }

    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLoadingPage = ref(true)

    const GETisLoadingSignIn = computed(() => isLoadingSignIn.value)
    const GETisLoadingPage = computed(
        () => isLoadingPage.value || session.value?.isPending,
    )
    const GETisLoadingSignUp = computed(() => isLoadingSignUp.value)
    const isLogged = computed(() => !!session.value?.data?.session)
    const GETUser = computed(() => session.value?.data?.user)

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
        } catch (error) {
            console.log(error)
        }

        return response
    }

    return {
        GETisLoadingSignIn,
        GETisLoadingSignUp,
        GETisLoadingPage,
        GETUser,
        isLogged,
        session,
        init,
        SETisLoadingPage,
        handleSignUp,
        handleSignIn,
        handleLogout,
    }
})
