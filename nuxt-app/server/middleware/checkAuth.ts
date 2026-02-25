import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    if (event.path.startsWith("/dashboard")) {
        const session = await auth.api.getSession({
            headers: event.headers,
        })
        console.log(session)
        if (!session) {
            await sendRedirect(event, "/", 302)
        } else {
            return
        }
    }
})
