import db from "~/lib/db"
import {
    quarto,
    reserva,
} from "~/lib/db/schemas/index"
import { eq, asc, desc, count } from "drizzle-orm"
import { auth } from "~/lib/auth"
import { paginatedReservationListQuerySchema } from "../../utils/schemas/reservation"
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
        const parsedQuery = paginatedReservationListQuerySchema.safeParse(query)

        if (!parsedQuery.success) {
            throw createError({
                statusCode: 400,
                statusMessage: "Invalid query parameters",
                data: zod.treeifyError(parsedQuery.error),
            })
        }

        const sortBy = parsedQuery.data.by
        const sortDir = parsedQuery.data.ascending
        const itemsPerPage = parsedQuery.data.itemsPerPage
        const page = parsedQuery.data.page
        const offset = (page - 1) * itemsPerPage

        // whitelist das colunas permitidas para ordenação
        const columnsMap: Record<string, typeof reserva.id | typeof reserva.status> = {
            id: reserva.id,
            status: reserva.status,
        }

        const orderColumn = columnsMap[sortBy] ?? reserva.id
        const orderClause =
            sortDir === "desc" ? desc(orderColumn) : asc(orderColumn)

        const user = session.user
        const userId = Number(user.id)

        try {
            const responseDB = await db
                .select()
                .from(reserva)
                .orderBy(orderClause)
                .leftJoin(quarto, eq(quarto.id, reserva.quartoId))
                .limit(itemsPerPage)
                .offset(offset)

            const responseDBCount = await db
                .select({ count: count() })
                .from(reserva)

            return { data: responseDB, totalRoomsNumber: responseDBCount[0]?.count || 0 }
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch reservations",
            })
        }
    }
})
