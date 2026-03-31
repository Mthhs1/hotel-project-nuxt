import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { adicionalItem } from "./adicionalItem"
import { quarto } from "./quarto"

export const adicionalRelacao = sqliteTable("adicionalRelacao", {
    id: int().primaryKey({ autoIncrement: true }),
    adicionalItemId: int().notNull().references(()=> adicionalItem.id),
    quartoId: int().notNull().references(()=> quarto.id)
})
