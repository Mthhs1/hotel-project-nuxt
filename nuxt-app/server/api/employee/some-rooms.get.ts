import db from "~/lib/db"
import { reserva, quarto, adicionalConsumido } from "~/lib/db/schemas/index"
import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth"


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
        console.log(
            "Requisitando parâmetros do evento para a listagem de quartos (employee)",
        )

        const query = await getQuery(event)
        const reservaId = Number(query.reservationId)
        const limit = Number(query.limit) ?? 1

        try {
            const selectedReservations = await db
                .select()
                .from(reserva)
                .where(eq(reserva.id, reservaId))
                .limit(1)

            if (!selectedReservations || selectedReservations.length === 0) {
                throw createError({
                    status: 404,
                    statusText: "Reservation not found",
                })
            }

            const reservation = selectedReservations[0]

            if (!reservation) {
                throw createError({
                    status: 404,
                    statusText: "Reservation not found",
                })
            }

            const selectedRooms = await db
                .select()
                .from(quarto)
                .where(eq(quarto.id, reservation.quartoId))
                .limit(limit)

            if (!selectedRooms || selectedRooms.length === 0) {
                throw createError({
                    status: 404,
                    statusText: "Room not found",
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
            throw createError({
                status: 500,
                statusText: "Internal Server Error",
            })
        }
    }
})
