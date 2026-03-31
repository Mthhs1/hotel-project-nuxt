import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { user } from "./auth-schema"
import { quarto } from "./quarto"

export const reserva = sqliteTable("reserva", {
    id: int().primaryKey({ autoIncrement: true }),
    quartoId: int()
        .notNull()
        .references(() => quarto.id),
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
    stayTime: int().notNull(),
    person: int().notNull(),
    status: text().notNull().default("pending"),
})

export type Reserva = typeof reserva.$inferSelect

