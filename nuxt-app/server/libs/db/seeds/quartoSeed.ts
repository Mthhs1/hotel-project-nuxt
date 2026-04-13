import db from "../../../../app/lib/db/index"
import { quarto } from "../../../../app/lib/db/schemas/quarto"

type newRoom = typeof quarto.$inferInsert

const quartoLuxuosoObj: newRoom = {
    discount: 1,
    basePrice: 200,
    hasDiscount: false,
    roomType: "Quarto Luxuoso",
    url: "/images/RoomsView/Room1/",
    baseCapacity: 2,
    maxCapacity: 5,
    extraPersonPrice: 50,
    priceMultiplier: 1.3,
    description:
        "Quarto com uma decoração luxuosa, oferecendo um ambiente sofisticado e confortável para os hóspedes que buscam uma experiência de hospedagem mais exclusiva.",
}

const quartoPadraoObj: newRoom = {
    discount: 1,
    basePrice: 100,
    hasDiscount: false,
    roomType: "Quarto Padrão",
    url: "/images/RoomsView/Room2/",
    priceMultiplier: 1.1,
    description:
        "Quarto com uma decoração simples e funcional, oferecendo um ambiente confortável e acolhedor para os hóspedes que buscam uma experiência de hospedagem mais acessível.",
    baseCapacity: 2,
    maxCapacity: 4,
    extraPersonPrice: 30,
}

const quartoClasseAltaObj: newRoom = {
    discount: 1,
    basePrice: 150,
    hasDiscount: false,
    baseCapacity: 3,
    maxCapacity: 6,
    extraPersonPrice: 80,
    roomType: "Quarto Classe Alta",
    url: "/images/RoomsView/Room3/",
    priceMultiplier: 1.1,
    description:
        "Quarto com uma decoração mais refinada, oferecendo um ambiente elegante e confortável para os hóspedes que buscam uma experiência de hospedagem mais sofisticada.",
}

const startRoooms: newRoom[] = [
    ...Array(5).fill(quartoLuxuosoObj),
    ...Array(15).fill(quartoPadraoObj),
    ...Array(4).fill(quartoClasseAltaObj),
]

export async function seedRooms() {
    await db.insert(quarto).values(startRoooms)
}
