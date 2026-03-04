import db from "~/lib/db"
import { quarto } from "~/lib/db/schemas"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    console.log("Requisitando parâmetros do evento")
    const query = await getQuery(event)
    const getRoomName = String(query.quarto)

    const response = await db
        .select()
        .from(quarto)
        .where(eq(quarto.roomType, getRoomName))
        .limit(1)

    const selectedRoom = response[0]
    
    return selectedRoom
})
