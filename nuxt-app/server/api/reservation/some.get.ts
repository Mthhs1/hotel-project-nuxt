// import db from "~/lib/db"
import { auth } from "~/lib/auth"
import db from "../../../app/lib/db/index"
import { reserva, quarto } from "../../../app/lib/db/schemas/index"
import { eq, and } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    const query = await getQuery(event)
    const reservaId = Number(query.id)

    if (session && session.user) {
        const user = session.user
        const userId = Number(user.id)

        try {
            const responseDB = await db
                .select()
                .from(reserva)
                .where(
                    and(eq(reserva.userId, userId), eq(reserva.id, reservaId)),
                )
                .leftJoin(quarto, eq(quarto.id, reserva.quartoId))
                .limit(1)

            console.log("Dados", responseDB[0])
            return responseDB.length > 0 ? responseDB[0] : null
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw new Error("Failed to fetch reservations")
        }
    }

    return null
})
