import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    if (event.path.startsWith("/dashboard")) {
        
        const session = await auth.api.getSession({
            headers: event.headers,
        })
                if (!session?.user) {
            await sendRedirect(event, "/", 302)
        }

        // event.context.session = session
        // console.log("Session do usuário (checkAuth, event.context.session):", !!event.context.session)
    }
})
