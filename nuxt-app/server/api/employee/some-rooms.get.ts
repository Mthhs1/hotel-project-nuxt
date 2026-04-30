import db from "~/lib/db"
import { reserva, quarto, adicionalConsumido } from "~/lib/db/schemas/index"
import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth"
import { employeeReservationRoomQuerySchema } from "../../utils/schemas/reservation"
import * as zod from "zod"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    if (!session || !session.user) {
        throw createError({
            status: 401,
            statusText: "Unauthorized",
        })
    } else if (session.user.role !== "employee") {
        throw createError({
            status: 403,
            statusText: "Forbidden",
        })
    } else {
        const query = await getQuery(event)
        const parsedQuery = employeeReservationRoomQuerySchema.safeParse(query)

        if (!parsedQuery.success) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid query parameters",
                data: zod.treeifyError(parsedQuery.error),
            })
        }

        const reservaId = parsedQuery.data.reservationId
        const limit = parsedQuery.data.limit

        try {
            const selectedReservations = await db
                .select()
                .from(reserva)
                .where(eq(reserva.id, reservaId))
                .limit(1)

            if (!selectedReservations || selectedReservations.length === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage: "Reservation not found",
                })
            }

            const reservation = selectedReservations[0]

            if (!reservation) {
                throw createError({
                    statusCode: 404,
                    statusMessage: "Reservation not found",
                })
            }

            const selectedRooms = await db
                .select()
                .from(quarto)
                .where(eq(quarto.id, reservation.quartoId))
                .limit(limit)

            if (!selectedRooms || selectedRooms.length === 0) {
                throw createError({
                    statusCode: 404,
                    statusMessage: "Room not found",
                })
            }

            const room = selectedRooms[0]

            const additionals = await db
                .select()
                .from(adicionalConsumido)
                .where(eq(adicionalConsumido.reservaId, reservaId))

            return {
                room,
                hours: reservation.stayTime,
                guests: reservation.person,
                additionals,
            }

        } catch (error) {
            if (isError(error)) {
                throw error
            }

            throw createError({
                statusCode: 500,
                statusMessage: "Internal Server Error",
            })
        }
    }
})
