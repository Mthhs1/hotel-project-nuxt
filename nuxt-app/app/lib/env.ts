import { z } from "zod"
import "dotenv/config"

const EnvSchema = z.object({
    NODE_ENV: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
})

/*
Isso faz a mesma coisa que

------------------------------- Definindo Schema
const UserSchema = z.object({
    id: z.string(),
    age: z.number().min(18),
    email: z.string().email(),
});
-------------------------------

// O tipo usuário deve ter esse molde (type)
type User = z.infer<typeof UserSchema>;

Equivalente a: { id: string; age: number; email: string; }
*/

// eslint-disable-next-line ts/no-redeclare
export type EnvSchema = z.infer<typeof EnvSchema>

// Se nao definimos uma variável em .env que esteja aqui, o servidor nao vai abrir
// eslint-disable-next-line node/prefer-global/process
export default EnvSchema.parse(process.env)
