import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { RESERVATION_STATUS } from "../../../../shared/const/reservationStatus"

const PENDING_STATUS = RESERVATION_STATUS[0]

import { user } from "./auth-schema"
import { quarto } from "./quarto"

export const reserva = sqliteTable("reserva", {
    id: int().primaryKey({ autoIncrement: true }),
    quartoId: int()
        .notNull()
        .references(() => quarto.id),
    userId: int()
        .references(() => user.id),
    firstName: text(),
    lastName: text(),
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
    status: text().notNull().default(PENDING_STATUS),
})

export type Reserva = typeof reserva.$inferSelect
