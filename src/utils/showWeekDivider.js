import { DateTime } from 'luxon'

// Given two dates, returns true iff date and nextDate are in different weeks. Weeks start on
// Monday. `date` must be before `nextDate`, chronologically ("next" means "following" in a list of
// dates from most recent to least recent.)
const showWeekDivider = (date, nextDate) => {
  let addWeekBorder = false

  // Both params must be DateTimes
  if (
    date == null ||
    nextDate == null ||
    !DateTime.isDateTime(date) ||
    !DateTime.isDateTime(nextDate)
  ) {
    return false
  }

  // Drop any time data on the dates. Whatever date we're talking about, a DailyStats UTC date or a
  // specific DateTime that a run occured on, they should be treated superficially as yyyy-mm-dd
  date = date.set({
    hour: 0,
    minute: 0,
    second: 0,
  })

  nextDate = nextDate.set({
    hour: 0,
    minute: 0,
    second: 0,
  })

  // This function assumes `date` comes before `nextDate`. If this is not the case, then the week
  // boundary logic will not be correct.
  if (date < nextDate) {
    return false
  }

  // If they're not in the same week, then show a divider
  if (
    date.weekday < nextDate.weekday ||
    date.diff(nextDate, 'days').days >= 7
  ) {
    addWeekBorder = true
  }

  return addWeekBorder
}

export default showWeekDivider
