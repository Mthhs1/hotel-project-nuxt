/*import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    if (event.path.startsWith("/dashboard")) {
        console.log("Aqui")
        const session = await auth.api.getSession({
            headers: event.headers,
        })
        if (!session?.user) {
            await sendRedirect(event, "/", 302)
        } else {
            return
        }
    }
})
*/