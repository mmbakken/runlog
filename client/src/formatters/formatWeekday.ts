import { DateTime } from "luxon"

// Given a date string, returns a string representing the weekday as a
// 3-character abbreviation.
const formatWeekday = (date: string) => {
  const dt = DateTime.fromISO(date)

  if (!dt.isValid) {
    return "–"
  }

  return dt.toLocaleString({ weekday: "long" }).substr(0, 3)
}

export default formatWeekday
