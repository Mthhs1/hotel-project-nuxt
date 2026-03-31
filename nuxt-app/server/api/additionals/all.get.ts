import db from "~/lib/db"
import { adicionalItem } from "~/lib/db/schemas"


export default defineEventHandler(async (event) => {
    const response = await db
        .select()
        .from(adicionalItem)

    return response
})
