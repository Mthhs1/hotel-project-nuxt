import type { StayTimeOption, MapHoursToInt, MapIntToHours} from "../types/stayTime"

export const STAY_TIME_OPTIONS: StayTimeOption[] = [
  "2 horas",
  "4 horas",
  "6 horas",
  "8 horas",
  "Per noite",
]

export const HOURS_TO_STAY_TIME: MapIntToHours = {
  2: "2 horas",
  4: "4 horas",
  6: "6 horas",
  8: "8 horas",
  12: "Per noite",
}

export const STAY_TIME_TO_HOURS: MapHoursToInt = {
  "2 horas": 2,
  "4 horas": 4,
  "6 horas": 6,
  "8 horas": 8,
  "Per noite": 12,
}

export const DEFAULT_STAY_TIME_MULTIPLIER: Record<number, number> = {
  2: 1,
  4: 2,
  6: 3,
  8: 4,
  12: 6,
}