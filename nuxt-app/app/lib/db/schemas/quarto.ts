import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const quarto = sqliteTable("quarto", {
    id: int().primaryKey({ autoIncrement: true }),
    basePrice: real().notNull(),
    discount: real().notNull(),
    priceMultiplier: real()
        .notNull()
        .$default(() => 1),
    url: text().notNull(),
    hasDiscount: int({ mode: "boolean" }).$default(() => false),
    roomType: text().notNull(),
    createdAt: int()
        .notNull()
        .$default(() => Date.now()),
    updateAt: int()
        .notNull()
        .$default(() => Date.now())
        .$onUpdate(() => Date.now()),
})
