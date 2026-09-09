import { DateTime } from "luxon"

// Given a date string, returns a string representing the month and day of the
// date in the locally common numeric format.
const formatDateShort = (date: string) => {
  const dt = DateTime.fromISO(date)

  if (!dt.isValid) {
    return "–"
  }

  return dt.toLocaleString({
    month: "numeric",
    day: "numeric",
  })
}

export default formatDateShort
