import { error } from "#build/ui"
import { defineStore } from "pinia"
import { authClient } from "~/lib/auth-client"
import { sleep } from "~/utils/sleep"

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

    async function startSession() {
        isLoadingHeaderIcons.value = true

        const headers = import.meta.server
            ? useRequestHeaders(["cookie"])
            : undefined

        const response = await authClient.getSession({
            fetchOptions: { headers: headers },
        })

        if (!response.error) {
            SET_Session(response.data)
            isLoadingHeaderIcons.value = false
            return true
        } else {
            console.log(response.error)
            isLoadingHeaderIcons.value = false
            return false
        }
    }

    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLoadingLogout = ref(false)
    const isLoadingHeaderIcons = ref(false)
    const isLoadingPage = ref(false)

    const GET_isLoadingSignIn = computed(() => isLoadingSignIn.value)
    const GET_isLoadingPage = computed(() => isLoadingPage.value)
    const GET_isLoadingSignUp = computed(() => isLoadingSignUp.value)
    const GET_isLogged = computed(() => !!session.value?.session)
    const GET_isLoadingLogout = computed(() => isLoadingLogout.value)
    const GET_user = computed(() => session.value?.user)

    function SETisLoadingPage(value: boolean) {
        isLoadingPage.value = value
    }

    function SET_Session(payload: SessionType | null) {
        session.value = payload
    }

    async function handleSignUp(credentials: NewUser): Promise<{
        code?: string | undefined
        message?: string | undefined
        status: number
        statusText: string
    } | null | undefined > {
        isLoadingSignUp.value = true

        await sleep(2000)

        const response = await authClient.signUp.email(credentials)

        isLoadingSignUp.value = false
        return response.error
    }

    async function handleSignIn(credentials: User): Promise<{
        code?: string | undefined
        message?: string | undefined
        status: number
        statusText: string
    } | null | undefined> {
        isLoadingSignIn.value = true

        await sleep(2000)

        const response = await authClient.signIn.email(credentials)

        if (!response.error) {
            const session = await authClient.getSession()
            SET_Session(session.data)
            isLoadingSignIn.value = false
        }

        isLoadingSignIn.value = false
        return response.error
    }

    async function handleLogout() {
        await sleep(2000)

        isLoadingLogout.value = true
        try {
            const { data, error } = await authClient.signOut()
            isLoadingLogout.value = false
            if (!error) {
                SET_Session(null)
                isLoadingLogout.value = false
                return data
            }
        } catch (error) {
            isLoadingLogout.value = false
            console.log(error)
        }
    }

    return {
        GET_isLoadingSignIn,
        GET_isLoadingSignUp,
        GET_isLoadingPage,
        GET_isLogged,
        GET_user,
        GET_isLoadingLogout,
        isLoadingHeaderIcons,
        session,
        startSession,
        SETisLoadingPage,
        handleSignUp,
        handleSignIn,
        handleLogout,
    }
})
