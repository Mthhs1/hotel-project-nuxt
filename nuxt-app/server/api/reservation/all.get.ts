import { auth } from "~/lib/auth"
import db from "~/lib/db"
import { quarto, reserva } from "~/lib/db/schemas"
import { asc, desc, eq } from "drizzle-orm"
import { reservationListQuerySchema } from "../../utils/schemas/reservation"
import * as zod from "zod"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    })

    const query = await getQuery(event)
    const parsedQuery = reservationListQuerySchema.safeParse(query)

    if (!parsedQuery.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid query parameters",
            data: zod.treeifyError(parsedQuery.error),
        })
    }

    const sortBy = parsedQuery.data.by
    const sortDir = parsedQuery.data.ascending

    // whitelist das colunas permitidas para ordenação
    const columnsMap: Record<string, any> = {
        id: reserva.id,
        status: reserva.status,
    }

    const orderColumn = columnsMap[sortBy] ?? reserva.id
    const orderClause =
        sortDir === "desc" ? desc(orderColumn) : asc(orderColumn)

    if (session && session.user) {
        const user = session.user
        const userId = Number(user.id)

        try {
            const responseDB = await db
                .select()
                .from(reserva)
                .where(eq(reserva.userId, userId))
                .orderBy(orderClause)
                .leftJoin(quarto, eq(quarto.id, reserva.quartoId))

            return responseDB
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch reservations",
            })
        }
    }

    return []
})
