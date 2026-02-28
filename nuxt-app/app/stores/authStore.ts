import { defineStore } from "pinia"
import { authClient } from "~/lib/auth-client"

interface User {
    email: string
    password: string
}

interface NewUser extends User {
    name: string
    birthDay: number
}

type SessionType = typeof authClient.$Infer.Session

export const useAuthStore = defineStore("authStore", () => {
    let session = ref<SessionType | null>(null)

    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLoadingPage = ref(true)

    const GETisLoadingSignIn = computed(() => isLoadingSignIn.value)
    const GET_isLoadingPage = computed(() => isLoadingPage.value)
    const GETisLoadingSignUp = computed(() => isLoadingSignUp.value)
    const isLogged = computed(() => !!session.value?.session)
    const user = computed(() => session.value?.user)

    function SETisLoadingPage(value: boolean) {
        isLoadingPage.value = value
    }

    function SET_Session(payload: SessionType | null) {
        session.value = payload
        console.log(session.value)
    }

    async function handleSignUp(credentials: NewUser) {
        isLoadingSignUp.value = true

        const { data, error } = await authClient.signUp.email(credentials)

        isLoadingSignUp.value = false
        console.log(data)
        console.log(error)
        return data
    }

    async function handleSignIn(credentials: User) {
        isLoadingSignIn.value = true

        const { data, error } = await authClient.signIn.email(credentials)

        if (!!data) {
            const session = await authClient.getSession()
            SET_Session(session.data)
        }
        return data
    }

    async function handleLogout() {
        const { data, error } = await authClient.signOut()
        SET_Session(null)

        return data
    }

    return {
        GETisLoadingSignIn,
        GETisLoadingSignUp,
        GET_isLoadingPage,
        user,
        isLogged,
        SET_Session,
        SETisLoadingPage,
        handleSignUp,
        handleSignIn,
        handleLogout,
    }
})
