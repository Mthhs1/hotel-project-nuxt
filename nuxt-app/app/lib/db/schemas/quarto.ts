import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const quarto = sqliteTable("quarto", {
    id: int().primaryKey({ autoIncrement: true }),
    precoBase: real().notNull(),
    desconto: real().notNull(),
    tipoQuarto: text().notNull(),
    createdAt: int().notNull().$default(() => Date.now()),
    updateAt: int().notNull().$onUpdate(() => Date.now()).$onUpdate(() => Date.now()),
})
