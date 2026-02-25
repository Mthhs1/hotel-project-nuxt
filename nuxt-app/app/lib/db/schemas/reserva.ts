import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { acessorio } from "./acessorio"
import { user } from "./auth-schema"
import { quarto } from "./quarto"

export const reserva = sqliteTable("reserva", {
    id: int().primaryKey({ autoIncrement: true }),
    quartoId: int()
        .notNull()
        .references(() => quarto.id),
    acessorioId: int()
        .notNull()
        .references(() => acessorio.id),
    userId: int()
        .notNull()
        .references(() => user.id),
    checkIn: int(),
    checkOut: int(),
    createdAt: int()
        .notNull()
        .$default(() => Date.now()),
    updateAt: int()
        .notNull()
        .$default(() => Date.now())
        .$onUpdate(() => Date.now()),
    status: text().notNull().default("pending"),
})
