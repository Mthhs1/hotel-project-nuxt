import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const acessorio = sqliteTable("acessorio", {
    id: int().primaryKey({ autoIncrement: true }),
    garage: int({ mode: "boolean" }).notNull(),
    nGarage: int().notNull(),
    miniFridge: int({ mode: "boolean" }).notNull(),
    tv: int({ mode: "boolean" }).notNull(),
    wifi: int({ mode: "boolean" }).notNull(),
    piscine: int({ mode: "boolean" }).notNull(),
    hydromassage: int({ mode: "boolean" }).notNull(),
    foods: text(),
    drinks: text(),
    createdAt: int()
        .notNull()
        .$default(() => Date.now()),
    updateAt: int()
        .notNull()
        .$onUpdate(() => Date.now())
        .$onUpdate(() => Date.now()),
})
