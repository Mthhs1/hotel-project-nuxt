import {
    type AdicionalItem,
    adicionalItem,
} from "../../../../app/lib/db/schemas/adicionalItem"
import {
    type Quarto,
    quarto,
    reserva,
    type Reserva,
} from "../../../../app/lib/db/schemas/index"
import db from "../../../../app/lib/db/index"

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const reservaStatusList = ["Confirmed", "Cancelled", "Completed"]
const reservaHorasList = [2, 4, 6, 12]

const dataAtual = Date.now()

export async function seedReservas() {
    const startReservas: Omit<
        Reserva,
        "id" | "createdAt" | "updateAt" | "userId"
    >[] = []

    const users = await fetch(
        "https://api.api-ninjas.com/v2/randomuser?count=30",
        {
            method: "GET",
            headers: {
                "X-Api-Key": process.env.X_API_KEY_GENERATE_USERS!,
            },
        },
    ).then((res) => res.json())

    const quartos: Quarto[] = await db.select().from(quarto)
    const adicionais: AdicionalItem[] = await db.select().from(adicionalItem)
    const quartoIndex = quartos.length - 1

    if (!quartos.length || !adicionais.length) {
        return
    }

    for (let i = 0; i < 30; i++) {
        const randomQuarto = quartos[getRandomInt(0, quartoIndex)]!
        const person = getRandomInt(1, randomQuarto.maxCapacity)
        const horas =
            reservaHorasList[getRandomInt(0, reservaHorasList.length - 1)]
        const status =
            reservaStatusList[getRandomInt(0, reservaStatusList.length - 1)]

        let checkIn: number | null = null
        let checkOut: number | null = null

        if (status === "Confirmed") {
            checkIn = getRandomInt(dataAtual - 3600 * 24 * 30, dataAtual)
        } else if (status === "Completed") {
            checkIn = getRandomInt(dataAtual - 3600 * 24 * 30, dataAtual)
            checkOut = getRandomInt(checkIn, dataAtual + 3600 * 24)
        }

        startReservas.push({
            person: person,
            stayTime: horas || 2,
            status: status!,
            checkIn: checkIn!,
            checkOut: checkOut!,
            quartoId: randomQuarto.id,
            firstName: users[i]?.first_name || "John",
            lastName: users[i]?.last_name || "Doe",
        })
    }

    await db.insert(reserva).values(startReservas)
}
