import db from "~/lib/db"
import { quarto } from "~/lib/db/schemas"
import { eq,asc } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    console.log("Requisitando parâmetros do evento")
    const query = await getQuery(event)
    const getRoomName = String(query.quarto)

    const pagination = Number(query.pagination)
    const page = Number(query.page)
    const offset = (page - 1) * pagination

    // const numberRooms = await db.$count(quarto)

    const response = await db
        .select()
        .from(quarto)
        .orderBy(asc(quarto.id))
        .where(eq(quarto.status, "available"))
        .limit(pagination)
        .offset(offset)

    return response
})
