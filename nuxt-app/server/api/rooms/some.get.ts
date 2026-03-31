import db from "~/lib/db"
import { quarto, type Quarto } from "~/lib/db/schemas"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    console.log("Requisitando parâmetros do evento")
    const query = await getQuery(event)
    console.log("Parâmetros", query)

    let selectedRoom: Quarto | undefined

    const whereCondition = String(query.by)
    // const identifier = String(query.identifier)

    if (whereCondition === "roomType") {
        const response = await db
            .select()
            .from(quarto)
            .where(eq(quarto.roomType, String(query.identifier)))
            .limit(1)

        selectedRoom = response[0]
    } else if (whereCondition === "id") {
        const response = await db
            .select()
            .from(quarto)
            .where(eq(quarto.id, Number(query.identifier)))
            .limit(1)

        selectedRoom = response[0]
    }

    return selectedRoom
})
