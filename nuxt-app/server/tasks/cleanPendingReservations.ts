import db from "../../app/lib/db/index"
import { type Reserva, reserva } from "../../app/lib/db/schemas/index"
import { eq } from "drizzle-orm"
import { RESERVATION_STATUS } from "../../shared/const/reservationStatus"

const PENDING_STATUS = RESERVATION_STATUS[0]
const CANCELLED_STATUS = RESERVATION_STATUS[3]
const PENDING_RESERVATION_TIMEOUT_MS = 15 * 60 * 1000

export default defineTask({
    meta: {
        name: "cleanPendingReservations",
    },
    async run() {
        console.log("Running clean pending reservations task...")

        let reservations: Reserva[] = []
        try {
            reservations = await db
                .select()
                .from(reserva)
                .where(eq(reserva.status, PENDING_STATUS))
        } catch (error) {
            console.error("Error fetching pending reservations:", error)
            return { result: "Error fetching pending reservations" }
        }

        let cleanedCount = 0
        for (const reservation of reservations) {
            const reservationCreatedAt = reservation.createdAt

            const reservationExpirationTimestamp =
                reservationCreatedAt + PENDING_RESERVATION_TIMEOUT_MS

            if (Date.now() > reservationExpirationTimestamp) {
                try {
                    await db
                        .update(reserva)
                        .set({ status: CANCELLED_STATUS })
                        .where(eq(reserva.id, reservation.id))
                    console.log(
                        `Cancelled reservation with id ${reservation.id} due to timeout.`,
                    )
                    cleanedCount++
                } catch (error) {
                    console.error(
                        `Error cancelling reservation with id ${reservation.id}:`,
                        error,
                    )
                }
            }
        }

        console.log(
            `Cleaned ${cleanedCount} pending reservations of ${reservations.length}.`,
        )
        return { result: "Success" }
    },
})
