import { DateTime } from 'luxon'

// Luxon date indexes: 1 => Monday, 7 => Sunday.
import type { WeekdayNumbers } from 'luxon'

/**
 * Finds the next date on the weekday which is the start of the week. Can be the
 * same date as `isoDate`.
 *
 * @param isoDate - A date, in ISO 8601 format (yyyy-mm-dd).
 * @param weekStartsOn - An integer representing what day of the week the user
 * considers the start of the week.
 * @returns The soonest date on or after `isoDate` which is the same weekday
 * value as `weekStartsOn`.
 */
const nextUpcomingWeekStart = (
  isoDate: string,
  weekStartsOn: WeekdayNumbers
) => {
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
