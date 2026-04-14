import { z } from "zod"

const EnvSchema = z.object({
    NODE_ENV: z.string(),
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    X_API_KEY_GENERATE_USERS: z.string(),
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

export type EnvSchema = z.infer<typeof EnvSchema>

export default EnvSchema.parse(process.env)
