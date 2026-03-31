import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { cardapioItem } from "./cardapioItem"
import { reserva } from "./reserva"

export const cardapioConsumido = sqliteTable("cardapioConsumido", {
    id: int().primaryKey({ autoIncrement: true }),
    cardapioItemId: int()
        .notNull()
        .references(() => cardapioItem.id),
    reservaId: int()
        .notNull()
        .references(() => reserva.id),
    quantity: int().notNull().default(1),
    priceAtTime: int().notNull(),
    createdAt: int()
        .notNull()
        .$default(() => Date.now()),
    updateAt: int()
        .notNull()
        .$onUpdate(() => Date.now())
        .$onUpdate(() => Date.now()),
})
