import { auth } from "~/lib/auth"
import { sleep } from "~/utils/sleep"
import { APIError, statusCodes } from "better-auth"

export default defineEventHandler(async (event) => {
    await sleep(2000)

    let body

    try {
        body = await readBody(event)
    } catch (error) {
        throw createError({
            cause: error,
            status: 400,
            message: "Erro na requisiçao do body",
        })
    }

    console.log("Credentials Server SignIn")
    console.log(body)

    let response

    try {
        // Mesmo que as credenciais estejam incorretas, ainda sim terá uma resposta
        // só terá entrará no catch se tiver um erro grave da API
        response = await auth.api.signInEmail({
            body: { ...body, rememberMe: false },
            asResponse: true,
            
        })
    } catch (error) {
        throw createError({
            cause: error,
            status: 400,
            message: "Erro na chamada da api de Login (better-auth)",
        })
    }

    return response
})
