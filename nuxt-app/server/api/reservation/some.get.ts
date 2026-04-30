import { auth } from "~/lib/auth"
import db from "~/lib/db"
import {
    type AdicionalConsumido,
    type AdicionalItem,
    adicionalConsumido,
    quarto,
    reserva,
    type Quarto,
    type Reserva,
} from "~/lib/db/schemas"
import { eq, and } from "drizzle-orm"
import { reservationByIdQuerySchema } from "../../utils/schemas/reservation"
import zod from "zod"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    let reservations: { quarto: Quarto | null; reserva: Reserva } | null = null

    const query = await getQuery(event)
    const parsedQuery = reservationByIdQuerySchema.safeParse(query)

    if (!parsedQuery.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid query parameters",
            data: zod.treeifyError(parsedQuery.error),
        })
    }

    const reservaId = parsedQuery.data.id

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
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch reservation",
            })
        }
        return reservations
    }

    throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
    })
})
