import * as zod from "zod"

export const reservationFormSchemaBase = zod.object({
    hours: zod.string().min(1, "Selecione a duração da estadia."),
    guests: zod.number().min(1, "Selecione o número de hóspedes."),
    booleanAdditionals: zod.array(zod.string()),
    quantityAdditionals: zod.record(
        zod.string(),
        zod.object({
            isMarked: zod.boolean(),
            quantity: zod.number(),
        }),
    ),
})

export const reservationFormSchema = reservationFormSchemaBase.superRefine(
    (data, ctx) => {
        // Validação personalizada para garantir que a quantidade seja maior que 0 quando um adicional de quantidade estiver marcado
        for (const [additionalId, additionalData] of Object.entries(
            data.quantityAdditionals,
        )) {
            if (additionalData.isMarked && additionalData.quantity <= 0) {
                ctx.addIssue({
                    code: "custom",
                    message:
                        "A quantidade deve ser maior que 0 para adicionais marcados.",
                    path: ["quantityAdditionals", additionalId, "quantity"],
                })
            }
        }
    },
)

export type ReservationFormSchemaBase = zod.infer<typeof reservationFormSchemaBase>
export type ReservationFormSchema = zod.infer<typeof reservationFormSchema>
