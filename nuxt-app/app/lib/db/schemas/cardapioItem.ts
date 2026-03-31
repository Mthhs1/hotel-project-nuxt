import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const cardapioItem = sqliteTable("cardapioItem", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    category: text().notNull(),
    basePrice: text().notNull(),
    createdAt: int()
        .notNull()
        .$default(() => Date.now()),
    updateAt: int()
        .notNull()
        .$onUpdate(() => Date.now())
        .$onUpdate(() => Date.now()),
})
