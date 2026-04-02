// import db from "~/lib/db"
import { auth } from "~/lib/auth"
import db from "../../../app/lib/db/index"
import { reserva, quarto } from "../../../app/lib/db/schemas/index"
import { eq, and, asc, desc } from "drizzle-orm"

interface MapHoursToPrice {
    [key: string]: number
}

export default defineEventHandler(async (event) => {

    const session = await auth.api.getSession({
        headers: event.headers,
    })


    const query = await getQuery(event)
    const sortBy = String(query.by || "id")
    const sortDir = String(query.ascending || "asc").toLowerCase()

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

            console.log(
                "Resposta do banco de dados para as reservas do usuário:",
                responseDB,
            )
            return responseDB
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw new Error("Failed to fetch reservations")
        }
    }

    return []
})
