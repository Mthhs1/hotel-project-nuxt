import db from "../../../../app/lib/db/index"
import { quarto } from "../../../../app/lib/db/schemas/quarto"

type newRoom = typeof quarto.$inferInsert

const startRoooms: newRoom[] = [
    {
        discount: 1,
        basePrice: 200,
        hasDiscount: false,
        roomType: "Quarto Luxuoso",
        url: "/images/RoomsView/Room1/",
        priceMultiplier: 1.3,
    },
    {
        discount: 1,
        basePrice: 100,
        hasDiscount: false,
        roomType: "Quarto Padrão",
        url: "/images/RoomsView/Room2/",
        priceMultiplier: 1.1,
    },
    {
        discount: 1,
        basePrice: 150,
        hasDiscount: false,
        roomType: "Quarto Classe Alta",
        url: "/images/RoomsView/Room3/",
        priceMultiplier: 1.1,
    },
]

// const insertRoom = async (room: newRoom) => {
//     return db.insert(quarto).values(room)
// }

export async function seedRooms() {
    await db.insert(quarto).values(startRoooms)
}
