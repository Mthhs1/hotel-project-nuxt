import db from "~/lib/db"
import {
    Reserva,
    reserva,
} from "~/lib/db/schemas/index"
import { eq, } from "drizzle-orm"
import { auth } from "~/lib/auth"
import { RESERVATION_STATUS, ReservationStatus } from "~/../shared/const/reservationStatus"

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

        const body = await readBody(event)
        const reservaId = Number(body.reservationId)
        const newStatus = String(body.newStatus) as ReservationStatus

        const validStatuses = [...RESERVATION_STATUS]
        if (!validStatuses.includes(newStatus)) {
            throw createError({
                status: 400,
                statusText: "Invalid status value",
            })
        }

        try {
            const responseDB = await db
                .update(reserva)
                .set({ status: newStatus })
                .where(eq(reserva.id, reservaId))
                .returning()

            if (responseDB[0]?.status === newStatus) {
                return {
                    message: "Reserva status atualizado com sucesso.",
                    newStatus: responseDB[0].status,
                }
            } else {
                throw createError({
                    status: 500,
                    statusText: "Failed to update reservation status",
                })
            }
        } catch (error) {
            console.error("Error fetching DB (change-status-reservation):", error)
            throw new Error("Failed to fetch reservations (change-status-reservation)")
        }
    }
})
