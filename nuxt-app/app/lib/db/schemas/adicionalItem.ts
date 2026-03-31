import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const adicionalItem = sqliteTable("adicionalItem", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    isOptional: int({ mode: "boolean" }).notNull(),
    basePrice: int().notNull(),
    icon: text(),
})

export type AdicionalItem = typeof adicionalItem.$inferSelect