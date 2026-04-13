import dashboardNavOptions from "../../utils/dashboardNavOptions"
import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    if (!session?.user) {
        throw createError({
            status: 401,
            message: "Unauthorized"
        })
    } else {
        const role = session.user.role || "user"
        const navOptions = dashboardNavOptions(role)
        return navOptions
    }
})
