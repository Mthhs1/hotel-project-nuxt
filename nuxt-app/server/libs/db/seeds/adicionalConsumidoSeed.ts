import { type AdicionalConsumido, adicionalItem, reserva, adicionalConsumido } from "../../../../app/lib/db/schemas/index"
import db from "../../../../app/lib/db/index"
import { eq } from "drizzle-orm"

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function seedAdicionalConsumido() {
    const startConsumidos: Omit<AdicionalConsumido, "id">[] = []
    const reservas = await db.select().from(reserva)
    const adicionais = await db
        .select()
        .from(adicionalItem)
        .where(eq(adicionalItem.isOptional, true))
    const adicionalIndex = adicionais.length - 1

    if (!reservas.length || !adicionais.length) {
        return
    }

    for (let i = 0; i < reservas.length; i++) {
        const reservaAtual = reservas[i]!
        const adicional = adicionais[getRandomInt(0, adicionalIndex)]!

        startConsumidos.push({
            reservaId: reservaAtual.id!,
            adicionalItemId: adicional.id,
            quantity:
                adicional.selectionType === "quantity" ? getRandomInt(1, 3) : 1,
            priceAtTime: adicional.basePrice,
        })
    }

    await db.insert(adicionalConsumido).values(startConsumidos)
}
