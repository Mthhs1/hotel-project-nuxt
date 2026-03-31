import db from "../../../../app/lib/db/index"
import { adicionalItem } from "../../../../app/lib/db/schemas/adicionalItem"

type newItems = typeof adicionalItem.$inferInsert

const startItem: newItems[] = [
    {
        name: "Hidromassagem",
        basePrice: 0,
        isOptional: false,
        icon: "streamline-plump:pool-ladder"
    },
    {
        name: "Internet cabeada",
        basePrice: 20,
        isOptional: true,
        icon: "ic:round-network-cell"
    },
    {
        name: "Mini frigorífico",
        basePrice: 20,
        isOptional: true,
        icon: "lucide-lab:refrigerator-freezer"
    },
    {
        name: "Canais de TV fechada",
        basePrice: 10,
        isOptional: true,
        icon: "tabler:device-tv",
    },
    {
        name: "Garagem",
        basePrice: 10,
        isOptional: true,
        icon: "material-symbols-light:parking-meter-outline",
    },
    {
        name: "Piscina",
        basePrice: 0,
        isOptional: false,
        icon: "ph:swimming-pool-bold"
    },
]

export async function seedAdicionalItem() {
    await db.insert(adicionalItem).values(startItem)
}
