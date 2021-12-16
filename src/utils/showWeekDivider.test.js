import { it, expect } from '@jest/globals'
import showWeekDivider from './showWeekDivider.js'
import { DateTime } from 'luxon'

// Parameter validation
it('returns false for null inputs', () => {
  expect(showWeekDivider(null, null)).toBe(false)
  expect(showWeekDivider(DateTime.now(), null)).toBe(false)
  expect(showWeekDivider(null, DateTime.now())).toBe(false)
})

it('returns false for string inputs', () => {
  expect(showWeekDivider('2021-12-17', '2021-12-16')).toBe(false)
  expect(showWeekDivider(DateTime.now(), '2021-12-16')).toBe(false)
  expect(showWeekDivider('2021-12-17', DateTime.now())).toBe(false)
})

it('returns false for JS Date inputs', () => {
  expect(showWeekDivider(Date('2021-12-17'), Date('2021-12-16'))).toBe(false)
  expect(showWeekDivider(DateTime.now(), Date('2021-12-16'))).toBe(false)
  expect(showWeekDivider(Date('2021-12-17'), DateTime.now())).toBe(false)
})

// Must return false when dates are in chronological order, otherwise week boundary logic will be wrong.
it('returns false when dates are in chronological order', () => {
  const date1 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 16,
  })
  const date2 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 17,
  })
  expect(showWeekDivider(date1, date2)).toBe(false)
})

// Weekday boundary logic
it('returns false for a Friday and the previous Thursday', () => {
  const date1 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 17,
  })
  const date2 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 16,
  })
  expect(showWeekDivider(date1, date2)).toBe(false)
})

it('returns true for a Monday and the previous Sunday', () => {
  const date1 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 20,
  })
  const date2 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 19,
  })
  expect(showWeekDivider(date1, date2)).toBe(true)
})

it('returns true for a Saturday and the previous Saturday', () => {
  const date1 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 18,
  })
  const date2 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 11,
  })
  expect(showWeekDivider(date1, date2)).toBe(true)
})

it('returns true for two dates more than 7 days apart', () => {
  const date1 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 16,
  })
  const date2 = DateTime.fromObject({
    year: 2021,
    month: 12,
    day: 3,
  })
  expect(showWeekDivider(date1, date2)).toBe(true)
})
