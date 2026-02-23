/* eslint-disable no-console */

import { auth } from "~/lib/auth"
import { sleep } from "~/utils/sleep"

export default defineEventHandler(async (event) => {

    await sleep(2000)
    const response = await auth.api.signOut({
        headers: event.headers,
        asResponse: true,
    })
    return response
})
