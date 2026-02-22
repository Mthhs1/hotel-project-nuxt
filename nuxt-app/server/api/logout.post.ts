/* eslint-disable no-console */

import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    const response = await auth.api.signOut({
        headers: event.headers,
        asResponse: true,
    })
    return response
})
