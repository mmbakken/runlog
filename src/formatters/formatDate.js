import { DateTime } from 'luxon'

// Given a date string, returns a string representing the date in locally common numeric format.
const formatDate = (date) => {
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

// Given a date string, returns a string representing the date in locally common numeric format.
const formatDateShort = (date) => {
  const dt = DateTime.fromISO(date)

  if (!dt.isValid) {
    return '–'
  }

  return dt.toLocaleString({
    month: 'numeric',
    day: 'numeric',
  })
}

export { formatDate, formatDateShort }
