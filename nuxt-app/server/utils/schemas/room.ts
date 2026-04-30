import { z } from "zod"

export const roomListQuerySchema = z.object({
    itemsPerPage: z.coerce.number().int().positive().max(100).default(8),
    page: z.coerce.number().int().positive().default(1),
})

export const roomLookupQuerySchema = z.object({
    by: z.enum(["roomType", "id"]),
    identifier: z.union([z.string().min(1), z.coerce.number().int().positive()]),
})
