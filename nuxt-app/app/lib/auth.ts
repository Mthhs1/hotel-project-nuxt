import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import db from "./db/index" // your drizzle instance

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        autoSignIn: false,
    },

    user: {
        additionalFields: {
            birthDay: {
                type: "number",
                required: true,
            },
        },
    },

    advanced: {
        database: {
            generateId: "serial",
        },
    },
})
