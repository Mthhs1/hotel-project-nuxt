
import { auth } from "~/lib/auth"

export default defineEventHandler(async (event) => {
    
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }

  return {
    user: {
      id: session.user.id,
      role: session.user.role,
      email: session.user.email,
    },
  }
})