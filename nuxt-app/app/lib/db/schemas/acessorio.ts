import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const acessorio = sqliteTable("acessorio", {
    id: int().primaryKey({ autoIncrement: true }),
    garagem: int({ mode: "boolean" }).notNull(),
    numeroGaragem: int().notNull(),
    frigobar: int({ mode: "boolean" }).notNull(),
    tv: int({ mode: "boolean" }).notNull(),
    wifi: int({ mode: "boolean" }).notNull(),
    piscina: int({ mode: "boolean" }).notNull(),
    hidromassagem: int({ mode: "boolean" }).notNull(),
    comida: text(),
    bebida: text(),
    createdAt: int().notNull().$default(() => Date.now()),
    updateAt: int().notNull().$onUpdate(() => Date.now()).$onUpdate(() => Date.now()),
})
