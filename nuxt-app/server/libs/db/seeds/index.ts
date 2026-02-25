import { seedRooms } from "./roomsSeed"

async function runAllSeeds() {
    
    console.log("Iniciando inserção no BD")
    try {
        await seedRooms()

        console.log("Inserção no BD Feita com sucesso!")
    } catch (err) {
        console.log(err)
    }

    process.exit()
}

runAllSeeds()