// import db from "~/lib/db"
import { auth } from "../../../app/lib/auth"
import db from "../../../app/lib/db/index"
import {
    reserva,
    type Reserva,
    adicionalItem,
} from "../../../app/lib/db/schemas/index"
import { eq, and } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers, // headers containing the user's session token
    })

    if (session && session.user) {
        const user = session.user
        const userId = Number(user.id)

        // checando se ja há uma reserva
        const response = await db
            .select()
            .from(reserva)
            .where(
                and(eq(reserva.userId, userId), eq(reserva.status, "pending")),
            )

        if (!response || response.length === 0) {
            const body = await readBody(event)

            const reservaData: Omit<Reserva, "id" | "createdAt" | "updateAt"> =
                {
                    quartoId: body.quartoId,
                    userId: userId,
                    checkIn: Date.now(),
                    checkOut: null,
                    stayTime: body.stayTime,
                    person: body.person,
                    status: "pending",
                }

            console.log(reservaData)

            const reservaResult = await db
                .insert(reserva)
                .values(reservaData)
                .returning()

            console.log(reservaResult)

            setResponseStatus(event, 201)
            return { message: "Reserva criada com sucesso!" }
        } else {
            throw createError({
                statusCode: 400,
                message: "Usuário já possui uma reserva ativa.",
            })
        }
    }
})
