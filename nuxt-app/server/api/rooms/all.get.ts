import db from "~/lib/db"
import { quarto, type Quarto } from "~/lib/db/schemas"
import { adicionalItem, type AdicionalItem } from "~/lib/db/schemas"
import { adicionalRelacao } from "~/lib/db/schemas"
import { eq, asc } from "drizzle-orm"

type quartoWithAdditionals = {
    quarto: Quarto
    adicionais: AdicionalItem[]
}

export default defineEventHandler(async (event) => {
    console.log("Requisitando parâmetros do evento para a listagem de quartos")
    const query = await getQuery(event)
    const getRoomName = String(query.quarto)

    const itemsPerPage = Number(query.itemsPerPage)
    const page = Number(query.page)
    const offset = (page - 1) * itemsPerPage

    const numberRooms = await db.$count(quarto)

    const roomsList = await db
        .select()
        .from(quarto)
        .orderBy(asc(quarto.id))
        .where(eq(quarto.status, "available"))
        .limit(itemsPerPage)
        .offset(offset)

    const rooms: quartoWithAdditionals[] = []

    roomsList.forEach((room) => {
        rooms.push({ quarto: room, adicionais: [] })
    })

    const relations = await db.select().from(adicionalRelacao)

    const additionals = await db.select().from(adicionalItem)

    relations.forEach((relation) => {
        const roomObj = rooms.find(
            (item) => item.quarto.id === relation.quartoId,
        )
        if (roomObj) {
            const aditional = additionals.find(
                (item) => item.id === relation.adicionalItemId,
            )
            if (aditional) {
                roomObj.adicionais.push(aditional)
            }
        }
    })

    return { rooms, numberRooms }
})
