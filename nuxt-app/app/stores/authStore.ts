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

    async function GETSession() {
        isLoadingHeaderIcons.value = true

        const headers = import.meta.server
            ? useRequestHeaders(["cookie"])
            : undefined

        const response = await authClient.getSession({
            fetchOptions: { headers: headers },
        })

        if (!response.error) {
            console.log("SUCESSO!")
            SET_Session(response.data)
        } else {
            console.log("ERRO!")
            console.log(response.error)
        }
        isLoadingHeaderIcons.value = false
    }

    const isLoadingSignIn = ref(false)
    const isLoadingSignUp = ref(false)
    const isLoadingHeaderIcons = ref(false)
    const isLoadingPage = ref(false)

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
        console.log("Session store:")
    }

    async function handleSignUp(credentials: NewUser) {
        isLoadingSignUp.value = true

        await sleep(2000)

        try {
            const { data, error } = await authClient.signUp.email(credentials)

            if (!error) {
                isLoadingSignUp.value = false
                return data
            } else {
                isLoadingSignUp.value = false
                return error
            }
        } catch (error) {
            console.log("Erro no login", error)
            isLoadingSignUp.value = false
            return error
        }
    }

    async function handleSignIn(credentials: User) {
        isLoadingSignIn.value = true

        await sleep(2000)
        try {
            const { data, error } = await authClient.signIn.email(credentials)
            if (!error) {
                const session = await authClient.getSession()
                SET_Session(session.data)
                isLoadingSignIn.value = false

                return data
            } else {
                isLoadingSignIn.value = false

                return error
            }
        } catch (err) {
            console.log("Erro no login.", err)
            isLoadingSignIn.value = false

            return error
        }
    }

    async function handleLogout() {
        await sleep(2000)

        try {
            const { data, error } = await authClient.signOut()
            
            if (!error) {
                return data
            }
        } catch (error) {
            
        }
        SET_Session(null)

        return data
    }

    return {
        GETisLoadingSignIn,
        GETisLoadingSignUp,
        GET_isLoadingPage,
        isLoadingHeaderIcons,
        session,
        user,
        isLogged,
        GETSession,
        SET_Session,
        SETisLoadingPage,
        handleSignUp,
        handleSignIn,
        handleLogout,
    }
})
