import db from "../../app/lib/db/index"
import { reserva } from "../../app/lib/db/schemas/index"
import { eq } from "drizzle-orm"

export default defineTask({
    meta: {
        name: "cleanPendingReservations",
    },
    async run() {
        console.log("Running clean pending reservations task...")

        const reservations = await db.select().from(reserva).where(eq(reserva.status, "pending"))
        const now = Date.now()
        let cleanedCount = 0

        for (const reservation of reservations) {

            const reservationCreatedAt = reservation.createdAt

            const reservationCreatedAtPlusTwoHours = reservationCreatedAt + 5* 60 * 1000

            if (Date.now() > reservationCreatedAtPlusTwoHours) {
                await db.update(reserva).set({status: "cancelled by system (time)"}).where(eq(reserva.id, reservation.id))
                console.log(`Cancelled reservation with id ${reservation.id} due to timeout.`)
                cleanedCount++
            }
        }
        
        console.log(`Cleaned ${cleanedCount} pending reservations.`)
        return { result: "Success" }
    },
})
