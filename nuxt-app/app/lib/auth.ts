import { betterAuth } from "better-auth"
import { createAuthMiddleware } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import db from "./db/index" // your drizzle instance

export const auth = betterAuth({

    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/get-session") {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null,
                    })
                }
                return ctx.json(ctx.context.session)
            }
        }),
    },

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
            role: {
                type: "string",
                required: true,
                // possibleValues: ["user", "employee", "admin"],
                defaultValue: "user",
            },
        },
    },

    advanced: {
        database: {
            generateId: "serial",
        },
    },
})
