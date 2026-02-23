import { auth } from "~/lib/auth"
import { sleep } from "~/utils/sleep"
sleep

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

    body.role = "user"

    let response

    try {
        response = await auth.api.signUpEmail({
            body,
            asResponse: true,
        })
    } catch (error) {
        throw createError({
            cause: error,
            status: 400,
            message: "Erro na chamada da api de Cadastro (better-auth)",
        })
    }

    return response
})
