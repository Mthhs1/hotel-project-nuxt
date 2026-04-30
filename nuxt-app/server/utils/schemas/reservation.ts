import { z } from "zod"
import { RESERVATION_STATUS } from "../../../shared/const/reservationStatus"

const reservationStatusEnum = z.enum(RESERVATION_STATUS)

export const reservationListQuerySchema = z.object({
    by: z.enum(["id", "status"]).default("id"),
    ascending: z.enum(["asc", "desc"]).default("asc"),
})

export const paginatedReservationListQuerySchema = reservationListQuerySchema.extend({
    itemsPerPage: z.coerce.number().int().positive().max(100).default(8),
    page: z.coerce.number().int().positive().default(1),
})

export const reservationByIdQuerySchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const employeeReservationRoomQuerySchema = z.object({
    reservationId: z.coerce.number().int().positive(),
    limit: z.coerce.number().int().positive().max(20).default(1),
})

export const changeReservationStatusBodySchema = z.object({
    reservationId: z.coerce.number().int().positive(),
    newStatus: reservationStatusEnum,
})

export const createReservationBodySchema = z.object({
    quartoId: z.number().int().positive(),
    person: z.number().int().positive(),
    stayTime: z.number().int().positive(),
    additionals: z.object({
        quantityAdditionals: z.record(
            z.string(),
            z.object({
                isMarked: z.boolean(),
                quantity: z.number().int().nonnegative(),
            }),
        ),
        booleanAdditionals: z.array(z.string()),
    }),
})

export type ChangeReservationStatusBody = z.infer<
    typeof changeReservationStatusBodySchema
>
