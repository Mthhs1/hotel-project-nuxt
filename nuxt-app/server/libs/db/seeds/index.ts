import { seedRooms } from "./quartoSeed"
import { seedAdicionalItem } from "./adicionalItemSeed"
import { seedAdicionalRelation } from "./adicionalRelacaoSeed"
import { seedReservas } from "./reservaSeed"
import { seedAdicionalConsumido } from "./adicionalConsumidoSeed"

async function runAllSeeds() {
    
    console.log("Iniciando inserção no BD")
    try {
        await seedRooms()
        await seedAdicionalItem()
        await seedAdicionalRelation()
        await seedReservas()
        await seedAdicionalConsumido()

        console.log("Inserção no BD Feita com sucesso!")
    } catch (err) {
        console.log(err)
    }

    process.exit()
}

runAllSeeds()