import db from "~/lib/db"
import { quarto, type Quarto } from "~/lib/db/schemas"
import { eq } from "drizzle-orm"
import { roomLookupQuerySchema } from "../../utils/schemas/room"
import zod from "zod"

export default defineEventHandler(async (event) => {
    const query = await getQuery(event)
    const parsedQuery = roomLookupQuerySchema.safeParse(query)

    if (!parsedQuery.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid query parameters",
            data: zod.treeifyError(parsedQuery.error),
        })
    }

    let selectedRoom: Quarto | undefined

    const whereCondition = parsedQuery.data.by

    if (whereCondition === "roomType") {
        const response = await db
            .select()
            .from(quarto)
            .where(eq(quarto.roomType, String(parsedQuery.data.identifier)))
            .limit(1)

        selectedRoom = response[0]
    } else if (whereCondition === "id") {
        const response = await db
            .select()
            .from(quarto)
            .where(eq(quarto.id, Number(parsedQuery.data.identifier)))
            .limit(1)

        selectedRoom = response[0]
    }

    return selectedRoom
})
