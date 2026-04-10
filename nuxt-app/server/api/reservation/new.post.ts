// import db from "~/lib/db"
import { auth } from "../../../app/lib/auth"
import db from "../../../app/lib/db/index"
import {
    reserva,
    type Reserva,
    type AdicionalConsumido,
    adicionalItem,
    adicionalConsumido,
} from "../../../app/lib/db/schemas/index"
import { eq, and, inArray } from "drizzle-orm"
import { DEFAULT_STAY_TIME_MULTIPLIER } from "~/../shared/const/stayTime"
import { type StayTimeOption } from "~/../shared/types/stayTime"

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

        // buscando reservas ativas do usuário (se existirem)
        const response = await db
            .select()
            .from(reserva)
            .where(
                and(eq(reserva.userId, userId), eq(reserva.status, "pending")),
            )

        // verificando se existem reservas ativas
        if (!response || response.length === 0) {
            // lendo os dados do corpo da requisição
            const body = await readBody<{
                quartoId: number
                person: number
                stayTime: string
                additionals?: {
                    quantityAdditionals: Record<
                        string,
                        { isMarked: boolean; quantity: number }
                    >
                    booleanAdditionals: string[]
                }
            }>(event)

            // criando a variavel para amarzenar o resultado da criação da reserva
            let reservaResult: Reserva[]

            // criando o objeto de dados para a nova reserva
            const reservaData: Omit<Reserva, "id" | "createdAt" | "updateAt"> =
                {
                    quartoId: body.quartoId,
                    userId: userId,
                    checkIn: null,
                    checkOut: null,
                    stayTime:
                        DEFAULT_STAY_TIME_MULTIPLIER[
                            body.stayTime as StayTimeOption
                        ],
                    person: body.person,
                    status: "pending",
                }

            // inserindo a nova reserva no banco de dados e armazenando o resultado
            try {
                reservaResult = await db
                    .insert(reserva)
                    .values(reservaData)
                    .returning()
            } catch (error) {
                console.error("Error creating reservation:", error)
                throw new Error("Failed to create reservation")
            }

            const additionalsUnion: Omit<AdicionalConsumido, "id">[] = []

            // buscando os detalhes dos adicionais
            const additionalItemsDB = await db.select().from(adicionalItem)
            const mapAdditionals = new Map(
                additionalItemsDB.map((item) => [String(item.id), item]),
            )

            // juntando os dois adicionais e formando o objeto para inserção em adicionalConsumido
            if (
                (body.additionals?.booleanAdditionals &&
                    body.additionals.booleanAdditionals.length > 0) ||
                (body.additionals?.quantityAdditionals &&
                    Object.keys(body.additionals.quantityAdditionals).length >
                        0)
            ) {
                // processando os booleanos
                if (
                    body.additionals?.booleanAdditionals &&
                    body.additionals.booleanAdditionals.length > 0
                ) {
                    for (const id of body.additionals.booleanAdditionals) {
                        if (mapAdditionals.has(id)) {
                            const item = mapAdditionals.get(id)
                            additionalsUnion.push({
                                adicionalItemId: Number(id),
                                reservaId: reservaResult[0]!.id,
                                quantity: 1,
                                priceAtTime: item!.basePrice,
                            })
                        }
                    }
                }

                // processando os quantitativos
                if (
                    body.additionals?.quantityAdditionals &&
                    Object.keys(body.additionals.quantityAdditionals).length > 0
                ) {
                    for (const [id, { isMarked, quantity }] of Object.entries(
                        body.additionals.quantityAdditionals,
                    )) {
                        if (isMarked && mapAdditionals.has(id)) {
                            const item = mapAdditionals.get(id)
                            additionalsUnion.push({
                                adicionalItemId: Number(id),
                                reservaId: reservaResult[0]!.id,
                                quantity: quantity,
                                priceAtTime: item!.basePrice,
                            })
                        }
                    }
                }
            }

            // inserindo os adicionais consumidos relacionados à reserva criada, caso existam
            if (additionalsUnion.length > 0) {
                await db.insert(adicionalConsumido).values(additionalsUnion)
            }

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
