import { type Quarto, type AdicionalItem } from "../../app/lib/db/schemas/index"
import {
    DEFAULT_STAY_TIME_MULTIPLIER,
} from "../const/stayTime"


export default function extractCalculate(
    room: Quarto,
    additionals: Record<string, AdicionalItem>,
    payload: {
        hours: number
        guests: number
        booleanAdditionals: string[]
        quantityAdditionals: Record<
            string,
            { isMarked: boolean; quantity: number }
        >
    },
) {
    // Calculando o preço dos hóspedes excedentes
    const guestsExcedeed = payload.guests - room.baseCapacity

    const guestsPrice =
        guestsExcedeed > 0 ? guestsExcedeed * room.extraPersonPrice : 0

    const hoursPrice =
        room.basePrice * (DEFAULT_STAY_TIME_MULTIPLIER[payload.hours] || 0)

    // Declarando variáveis para armazenar os preços dos adicionais
    const booleanAdditionalsPrice: Record<string, number> = {}
    const quantityAdditionalsPrice: Record<
        string,
        { price: number; quantity: number }
    > = {}

    // Criando os objetos de preços para os adicionais de seleção (booleanos)
    // {id: price}
    payload.booleanAdditionals.forEach((additionalId) => {
        const additional = additionals[additionalId]
        if (additional) {
            booleanAdditionalsPrice[additionalId] = additional.basePrice
        }
    })

    // criando os objetos de preços para os adicionais de quantidade
    // usamos a função object.entries que retorna [key, value] para iterar sobre o objeto quantityAdditionals
    // {id: {price, quantity}}
    for (const [additionalId, { isMarked, quantity }] of Object.entries(
        payload.quantityAdditionals,
    )) {
        const additional = additionals[additionalId]

        if (additional && isMarked) {
            quantityAdditionalsPrice[additionalId] = {
                price: additional.basePrice * quantity,
                quantity,
            }
        }
    }

    // Calculando o preço total dos adicionais de seleção e de quantidade
    const booleanAdditionalsTotal = Object.values(
        booleanAdditionalsPrice,
    ).reduce((acc, value) => acc + value, 0)

    const quantityAdditionalsTotal = Object.values(
        quantityAdditionalsPrice,
    ).reduce((acc, value) => acc + value.price, 0)

    // Calculando o preço total dos adicionais
    const totalAdditionalsPrice =
        booleanAdditionalsTotal + quantityAdditionalsTotal

    // Calculando o preço total da reserva
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
