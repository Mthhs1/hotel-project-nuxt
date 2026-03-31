import { adicionalRelacao } from "../../../../app/lib/db/schemas/adicionalRelacao"
import { adicionalItem } from "../../../../app/lib/db/schemas/adicionalItem"
import { quarto } from "../../../../app/lib/db/schemas/quarto"
import db from "../../../../app/lib/db/index"

type newRelations = typeof adicionalRelacao.$inferInsert

const startItem: newRelations[] = []

const quartoLuxuoso = ["Piscina"]
const quartoClasseAlta = ["Piscina", "Hidromassagem"]

export async function seedAdicionalRelation() {
    const adicionais = await db.select().from(adicionalItem)

    const quartosArray = await db
        .select({
            id: quarto.id,
            roomType: quarto.roomType,
        })
        .from(quarto)

    quartosArray.forEach((quarto) => {
        if (quarto.roomType === "Quarto Luxuoso") {
            adicionais.forEach((adicional) => {
                if (quartoLuxuoso.includes(adicional.name)) {
                    startItem.push({
                        adicionalItemId: adicional.id,
                        quartoId: quarto.id,
                    })
                }
            })
        } else if (quarto.roomType === "Quarto Classe Alta") {
            adicionais.forEach((adicional) => {
                if (quartoClasseAlta.includes(adicional.name)) {
                    startItem.push({
                        adicionalItemId: adicional.id,
                        quartoId: quarto.id,
                    })
                }
            })
        }
    })

    await db.insert(adicionalRelacao).values(startItem)
}
