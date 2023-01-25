import { DateTime } from 'luxon'

// Given a date string, returns a string representing the weekday as a 3-char abbreviation.
const formatWeekday = (date) => {
  const dt = DateTime.fromISO(date)

  if (!dt.isValid) {
    return '–'
  }

  return dt.toLocaleString({ weekday: 'long' }).substr(0, 3)
}

export default formatWeekday
