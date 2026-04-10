import type { StayTimeOption, MapHoursToInt} from "../types/stayTime"

export const STAY_TIME_OPTIONS: StayTimeOption[] = [
  "2 horas",
  "4 horas",
  "6 horas",
  "8 horas",
  "Per noite",
]

export const DEFAULT_STAY_TIME_MULTIPLIER: MapHoursToInt = {
  "2 horas": 1,
  "4 horas": 2,
  "6 horas": 3,
  "8 horas": 4,
  "Per noite": 6,
}