import { it, expect } from '@jest/globals'
import nextUpcomingWeekStart from './nextUpcomingWeekStart.js'
import { DateTime } from 'luxon'

// Parameter validation
it('returns null for bad inputs', () => {
  expect(nextUpcomingWeekStart(null, null)).toBe(null)
  expect(nextUpcomingWeekStart(DateTime.now(), null)).toBe(null)
  expect(nextUpcomingWeekStart(null, 1)).toBe(null)
  expect(nextUpcomingWeekStart(Date('2022-06-02'), 1)).toBe(null)
})

// Tests for date inputs before, on, and after the start of the week
it('Handles a Saturday start of week and Friday input date', () => {
  // Saturday
  const startOfWeek = 6

  const friday = '2022-06-03'
  const saturday = '2022-06-04'
  const sunday = '2022-06-05'
  const nextSaturday = '2022-06-11'

  expect(nextUpcomingWeekStart(friday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(saturday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(sunday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(friday, startOfWeek).toISODate()).toBe(saturday)
  expect(nextUpcomingWeekStart(saturday, startOfWeek).toISODate()).toBe(
    saturday
  )
  expect(nextUpcomingWeekStart(sunday, startOfWeek).toISODate()).toBe(
    nextSaturday
  )
})

it('Handles a Sunday start of week', () => {
  // Sunday
  const startOfWeek = 7

  const saturday = '2022-06-04'
  const sunday = '2022-06-05'
  const monday = '2022-06-06'
  const nextSunday = '2022-06-12'

  expect(nextUpcomingWeekStart(saturday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(sunday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(monday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(saturday, startOfWeek).toISODate()).toBe(sunday)
  expect(nextUpcomingWeekStart(sunday, startOfWeek).toISODate()).toBe(sunday)
  expect(nextUpcomingWeekStart(monday, startOfWeek).toISODate()).toBe(
    nextSunday
  )
})

it('handles a Monday start of week', () => {
  // Monday
  const startOfWeek = 1

  const sunday = '2022-06-05'
  const monday = '2022-06-06'
  const tuesday = '2022-06-07'
  const nextMonday = '2022-06-13'

  expect(nextUpcomingWeekStart(sunday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(monday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(tuesday, startOfWeek)).not.toBe(null)
  expect(nextUpcomingWeekStart(sunday, startOfWeek).toISODate()).toBe(monday)
  expect(nextUpcomingWeekStart(monday, startOfWeek).toISODate()).toBe(monday)
  expect(nextUpcomingWeekStart(tuesday, startOfWeek).toISODate()).toBe(
    nextMonday
  )
})
