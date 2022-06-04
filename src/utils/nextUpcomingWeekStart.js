import { DateTime } from 'luxon'

// Given a string is ISO date format (yyyy-mm-dd) ``
// Given an integer representing the start of the weekday `weekStartsOn`
// Returns a Luxon DateTime object representing the soonest date on or after isoDate which is the same weekday value as weekStartsOn
const nextUpcomingWeekStart = (isoDate, weekStartsOn) => {
  if (
    isoDate == null ||
    weekStartsOn == null ||
    typeof weekStartsOn !== 'number' ||
    weekStartsOn < 0 ||
    weekStartsOn > 7
  ) {
    return null
  }

  const dt = DateTime.fromISO(isoDate)

  if (!dt.isValid) {
    return null
  }

  // Base case: it's today!
  if (dt.weekday === weekStartsOn) {
    return dt
  }

  // Otherwise, it's a day in the future
  // Naive solution: Add a day to dt, see if its the same as the desired weekday
  let nextDate = dt
  for (let i = 1; i < 7; i++) {
    nextDate = dt.plus({ days: i })
    if (nextDate.weekday === weekStartsOn) {
      return nextDate
    }
  }

  return null
}

export default nextUpcomingWeekStart
