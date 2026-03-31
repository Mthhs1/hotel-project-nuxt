import { seedRooms } from "./quartoSeed"
import { seedAdicionalItem } from "./adicionalItemSeed"
import { seedAdicionalRelation } from "./adicionalRelacaoSeed"

async function runAllSeeds() {
    
    console.log("Iniciando inserção no BD")
    try {
        await seedRooms()
        await seedAdicionalItem()
        await seedAdicionalRelation()

        console.log("Inserção no BD Feita com sucesso!")
    } catch (err) {
        console.log(err)
    }

    process.exit()
}

runAllSeeds()