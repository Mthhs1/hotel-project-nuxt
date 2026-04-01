// import db from "~/lib/db"
import { auth } from "../../../app/lib/auth"
import db from "../../../app/lib/db/index"
import {
    reserva,
    type Reserva,
    adicionalItem,
} from "../../../app/lib/db/schemas/index"
import { eq, and } from "drizzle-orm"

interface MapHoursToPrice {
    [key: string]: number
}

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers, // headers containing the user's session token
    })

    if (session && session.user) {
        const user = session.user
        const userId = Number(user.id)

        try {
            const responseDB = await db
                .select()
                .from(reserva)
                .where(eq(reserva.userId, userId))
                
        } catch (error) {
            console.error("Error fetching reservations:", error)
            throw new Error("Failed to fetch reservations")
        }
    }
})
