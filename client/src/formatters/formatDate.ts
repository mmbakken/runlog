import { DateTime } from 'luxon'

// Given a date string, returns a string representing the date in the locally
// common numeric format.
const formatDate = (date: string) => {
  const dt = DateTime.fromISO(date)

  if (!dt.isValid) {
    return '–'
  }

  return dt.toLocaleString({
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  })
}

export default formatDate
