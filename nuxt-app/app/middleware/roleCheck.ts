export default defineNuxtRouteMiddleware(async (to) => {
    if (
        !to.path.startsWith("/dashboard/employee") ||
        !to.path.includes("/employee")
    )
        return

    try {
        const headers = import.meta.server
            ? useRequestHeaders(["cookie"])
            : undefined

        const session = await $fetch("/api/me/session", {
            headers,
        })

        if (!session?.user || session.user.role !== "employee") {
            return navigateTo("/dashboard")
        }
    } catch {
        return navigateTo("/")
    }
})
