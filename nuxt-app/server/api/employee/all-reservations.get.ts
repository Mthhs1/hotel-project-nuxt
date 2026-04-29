import db from "~/lib/db"
import {
    quarto,
    reserva,
} from "~/lib/db/schemas/index"
import { eq, asc, desc, count } from "drizzle-orm"
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
        const sortBy = String(query.by || "id")
        const sortDir = String(query.ascending || "asc").toLowerCase()

        const itemsPerPage = Number(query.itemsPerPage)
        const page = Number(query.page)
        const offset = (page - 1) * itemsPerPage

        // whitelist das colunas permitidas para ordenação
        const columnsMap: Record<string, any> = {
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

            console.log(
                "Resposta do banco de dados (employee):",
                responseDB.slice(0, 2),
            )
            return { data: responseDB, totalRoomsNumber: responseDBCount[0]?.count || 0 }
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw new Error("Failed to fetch reservations")
        }
    }
})
