import { type Quarto, type AdicionalItem } from "../../app/lib/db/schemas/index"
import { DEFAULT_STAY_TIME_MULTIPLIER } from "../const/stayTime"
import { type StayTimeOption } from "../types/stayTime"

export default function extractCalculate(
    room: Quarto,
    additionals: Record<string, AdicionalItem>,
    payload: {
        hours: string
        guests: number
        booleanAdditionals: string[]
        quantityAdditionals: Record<
            string,
            { isMarked: boolean; quantity: number }
        >
    },
) {
    const guestsExcedeed = payload.guests - room.baseCapacity

    const hoursPrice =
        room.basePrice *
        DEFAULT_STAY_TIME_MULTIPLIER[payload.hours as StayTimeOption] || 0

    const guestsPrice =
        guestsExcedeed > 0 ? guestsExcedeed * room.extraPersonPrice : 0

    const booleanAdditionalsPrice: Record<string, number> = {}
    const quantityAdditionalsPrice: Record<string, { price: number ,quantity: number}> = {}

    payload.booleanAdditionals.forEach((additionalId) => {
        const additional = additionals[additionalId]
        if (additional) {
            booleanAdditionalsPrice[additionalId] = additional.basePrice
        }
    })

    for (const [additionalId, { isMarked, quantity }] of Object.entries(
        payload.quantityAdditionals,
    )) {
        const additional = additionals[additionalId]

        if (additional && isMarked) {
            quantityAdditionalsPrice[additionalId] =
                { price: additional.basePrice * quantity, quantity }
        }
    }

    const booleanAdditionalsTotal = Object.values(booleanAdditionalsPrice).reduce((acc, value) => acc + value, 0)
    const quantityAdditionalsTotal = Object.values(quantityAdditionalsPrice).reduce((acc, value) => acc + value.price, 0)

    const totalAdditionalsPrice = booleanAdditionalsTotal + quantityAdditionalsTotal

    const totalPrice = hoursPrice + guestsPrice + totalAdditionalsPrice

    return {
        hoursPrice,
        guestsPrice,
        totalAdditionalsPrice,
        quantityAdditionalsPrice,
        booleanAdditionalsPrice,
        totalPrice,
    }
}
