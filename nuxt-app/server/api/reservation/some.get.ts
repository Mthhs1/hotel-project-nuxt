// import db from "~/lib/db"
import { auth } from "~/lib/auth"
import db from "../../../app/lib/db/index"
import {
    reserva,
    quarto,
    adicionalConsumido,
    adicionalItem,
    type Quarto,
    type Reserva,
    type AdicionalConsumido,
    type AdicionalItem,
} from "../../../app/lib/db/schemas/index"
import { eq, and } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    let reservations: { quarto: Quarto | null; reserva: Reserva } | null = null

    const query = await getQuery(event)
    const reservaId = Number(query.id)

    if (session && session.user) {
        const user = session.user
        const userId = Number(user.id)

        try {
            const responseDBreservations = await db
                .select()
                .from(reserva)
                .where(
                    and(eq(reserva.userId, userId), eq(reserva.id, reservaId)),
                )
                .leftJoin(quarto, eq(quarto.id, reserva.quartoId))
                .limit(1)

            reservations = responseDBreservations[0] || null
            // return responseDB.length > 0 ? responseDB[0] : null
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw new Error("Failed to fetch reservations")
        }

        let additionals: {
            adicionalItem: AdicionalItem
            adicionalConsumido: AdicionalConsumido
        }[] = []

        if (reservations && Object.keys(reservations).length > 0) {
            try {
                const responseDBadditionals = await db
                    .select()
                    .from(adicionalConsumido)
                    .where(
                        eq(
                            adicionalConsumido.reservaId,
                            reservaId,
                        ),
                    )

            } catch (error) {
                console.error("Error fetching additional items:", error)
            }
        }

        return reservations
    }
})
