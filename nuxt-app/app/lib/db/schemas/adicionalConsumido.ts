import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { adicionalItem } from "./adicionalItem"
import { reserva } from "./reserva"

export const adicionalConsumido = sqliteTable("adicionalConsumido", {
    id: int().primaryKey({ autoIncrement: true }),
    adicionalItemId: int().notNull().references(()=> adicionalItem.id),
    reservaId: int().notNull().references(()=> reserva.id),
    quantity: int().notNull(),
    priceAtTime: int().notNull(),
})

export type AdicionalConsumido = typeof adicionalConsumido.$inferSelect
