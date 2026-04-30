// import db from "~/lib/db"
import { auth } from "../../../app/lib/auth"
import db from "../../../app/lib/db/index"
import {
    type Reserva,
    type AdicionalConsumido,
    type Quarto,
    type AdicionalItem,
    reserva,
    adicionalItem,
    adicionalConsumido,
    quarto,
} from "../../../app/lib/db/schemas/index"
import { eq, and, inArray } from "drizzle-orm"
import { DEFAULT_STAY_TIME_MULTIPLIER } from "~/../shared/const/stayTime"
import { RESERVATION_STATUS } from "~/../shared/const/reservationStatus"
import extractCalculate from "../../../shared/helpers/extractCalculate"

const PENDING_STATUS = RESERVATION_STATUS[0]

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
                and(eq(reserva.userId, userId), eq(reserva.status, PENDING_STATUS)),
            )

        // verificando se existem reservas ativas
        if (!response || response.length === 0) {
            // lendo os dados do corpo da requisição
            const body = await readBody<{
                quartoId: number
                person: number
                stayTime: number
                additionals: {
                    quantityAdditionals: Record<
                        string,
                        { isMarked: boolean; quantity: number }
                    >
                    booleanAdditionals: string[]
                }
            }>(event)

            // criando a variavel para amarzenar o resultado da criação da reserva
            let reservaResult: Reserva[]
            let room: Quarto | null

            // buscando os detalhes do quarto para calcular o preço total da reserva
            try {
                const roomResponse = await db
                    .select()
                    .from(quarto)
                    .where(eq(quarto.id, body.quartoId))
                room = roomResponse[0] || null
            } catch (error) {
                console.error("Error fetching room details:", error)
                throw new Error("Failed to fetch room details")
            }

            // buscando os detalhes dos adicionais
            let additionalsResponse: AdicionalItem[]
            try {
                additionalsResponse = await db.select().from(adicionalItem)
            } catch (error) {
                console.error("Error fetching additionals:", error)
                throw new Error("Failed to fetch additionals")
            }

            // mapeando os adicionais para um formato de fácil acesso por id
            const additionalsDB: Record<string, AdicionalItem> = {}
            additionalsResponse.forEach((additional) => {
                additionalsDB[String(additional.id)] = additional
            })

            // usando uma função auxiliar para calcular os preços dos adicionais
            const { booleanAdditionalsPrice, quantityAdditionalsPrice } =
                extractCalculate(room!, additionalsDB, {
                    hours: body.stayTime,
                    guests: body.person,
                    booleanAdditionals: body.additionals.booleanAdditionals,
                    quantityAdditionals: body.additionals.quantityAdditionals,
                })

            // criando o objeto de dados para a nova reserva
            const reservaData: Omit<Reserva, "id" | "createdAt" | "updateAt"> =
                {
                    quartoId: body.quartoId,
                    userId: userId,
                    firstName: null,
                    lastName: null,
                    checkIn: null,
                    checkOut: null,
                    stayTime: body.stayTime,
                    person: body.person,
                    status: PENDING_STATUS,
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

            // declarando um array para armazenar os adicionais consumidos relacionados à reserva criada
            const additionalsUnion: Omit<AdicionalConsumido, "id">[] = []

            // inserindo os adicionais de seleção (booleanos) selecionados, caso existam,
            // no array de adicionais consumidos relacionados à reserva criada
            if (booleanAdditionalsPrice) {
                for (const [id, price] of Object.entries(
                    booleanAdditionalsPrice,
                )) {
                    additionalsUnion.push({
                        adicionalItemId: Number(id),
                        reservaId: reservaResult[0]!.id,
                        quantity: 1,
                        priceAtTime: price,
                    })
                }
            }

            // inserindo os adicionais de quantidade selecionados, caso existam, 
            // no array de adicionais consumidos relacionados à reserva criada
            if (quantityAdditionalsPrice) {
                for (const [id, { price, quantity }] of Object.entries(
                    quantityAdditionalsPrice,
                )) {
                    additionalsUnion.push({
                        adicionalItemId: Number(id),
                        reservaId: reservaResult[0]!.id,
                        quantity: quantity,
                        priceAtTime: price,
                    })
                }
            }

            // inserindo os adicionais consumidos relacionados à reserva criada, caso existam
            if (additionalsUnion.length > 0) {
                try {
                    await db.insert(adicionalConsumido).values(additionalsUnion)
                } catch (error) {
                    console.error("Error inserting consumed additionals:", error)
                    throw new Error("Failed to insert consumed additionals")
                }
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
