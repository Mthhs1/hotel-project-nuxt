/* eslint-disable no-console */

import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    console.log("Credentials server")
    console.log(body)

    const response = await auth.api.signUpEmail({
        body,
        asResponse: true,
    })

    console.log(body)
    console.log(response)

    return response
})
