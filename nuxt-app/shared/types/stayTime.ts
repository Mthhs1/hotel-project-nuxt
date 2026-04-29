export type StayTimeOption =
  | "2 horas"
  | "4 horas"
  | "6 horas"
  | "8 horas"
  | "Per noite"

export type MapHoursToInt = Record<StayTimeOption, number>

export type MapIntToHours = Record<number, StayTimeOption>