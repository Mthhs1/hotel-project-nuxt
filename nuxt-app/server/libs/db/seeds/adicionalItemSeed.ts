import db from "../../../../app/lib/db/index"
import { adicionalItem } from "../../../../app/lib/db/schemas/adicionalItem"

type newItems = typeof adicionalItem.$inferInsert

const startItem: newItems[] = [
    {
        name: "Hidromassagem",
        basePrice: 0,
        isOptional: false,
        icon: "streamline-plump:pool-ladder",
        description:
            "Relaxe em uma banheira de hidromassagem privativa, perfeita para aliviar o estresse e desfrutar de momentos de puro conforto.",
        selectionType: "boolean",
    },
    {
        name: "Internet cabeada",
        basePrice: 20,
        isOptional: true,
        icon: "tabler:device-desktop-check",
        description:
            "Acesso à internet cabeada para uma experiência de navegação rápida e confiável.",
        selectionType: "boolean",
    },
    {
        name: "Mini frigorífico",
        basePrice: 20,
        isOptional: true,
        description: "Mini Freezer para armazenar alimentos/bebidas.",
        icon: "lucide-lab:refrigerator-freezer",
        selectionType: "boolean",
    },
    {
        name: "Canais de TV fechada",
        basePrice: 10,
        isOptional: true,
        icon: "tabler:device-tv",
        description: "Acesso a canais de TV fechada para entretenimento.",
        selectionType: "boolean",
    },
    {
        name: "Garagem",
        basePrice: 10,
        isOptional: true,
        icon: "material-symbols-light:parking-meter-outline",
        description: "Acesso a uma garagem privativa para estacionar veículos.",
        selectionType: "quantity",
    },
    {
        name: "Piscina",
        basePrice: 0,
        isOptional: false,
        icon: "ph:swimming-pool-bold",
        description:
            "Acesso a uma piscina para relaxar e se refrescar durante a estadia.",
        selectionType: "boolean",
    },
]

export async function seedAdicionalItem() {
    await db.insert(adicionalItem).values(startItem)
}
