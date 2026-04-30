export const RESERVATION_STATUS = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
] as const

export type ReservationStatus = (typeof RESERVATION_STATUS)[number]

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
    pending: "Pendente",
    confirmed: "Confirmada",
    completed: "Concluida",
    cancelled: "Cancelada",
}

export const RESERVATION_STATUS_BADGE_COLOR: Record<
    ReservationStatus,
    "success" | "warning" | "error" | "primary" | "secondary" | "info" | "neutral"
> = {
    pending: "warning",
    confirmed: "info",
    completed: "success",
    cancelled: "error",
}