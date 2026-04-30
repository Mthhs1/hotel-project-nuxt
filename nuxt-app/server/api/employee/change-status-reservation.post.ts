import db from "~/lib/db"
import * as zod from "zod"
import { reserva } from "~/lib/db/schemas"
import { eq } from "drizzle-orm"
import { auth } from "~/lib/auth"
import { changeReservationStatusBodySchema } from "../../utils/schemas/reservation"

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
        const body = await readBody(event)
        const parsedBody = changeReservationStatusBodySchema.safeParse(body)

        if (!parsedBody.success) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid request body",
                data: zod.treeifyError(parsedBody.error),
            })
        }

        const reservaId = parsedBody.data.reservationId
        const newStatus = parsedBody.data.newStatus

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
                    statusCode: 500,
                    statusMessage: "Failed to update reservation status",
                })
            }
        } catch (error) {
            console.error(
                "Error fetching DB (change-status-reservation):",
                error,
            )
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to change reservation status",
            })
        }
    }
})
