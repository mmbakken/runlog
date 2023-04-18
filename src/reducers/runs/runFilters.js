import { DateTime } from 'luxon'
import initialState from '../initialState'
import { formatActualMileage } from '../../formatters/formatMileage'

// Given the runs by their id mapping and a filter object,
// Returns an array of run._id strings that pass the filters.
const getFilteredRunIds = (runsById, filters) => {
  const filteredRunIds = []

  for (let runId of Object.keys(runsById)) {
    let run = runsById[runId]

    // If this run passes the filters, include it in the results array
    if (
      passesDateFilter(run, filters.startDate, filters.endDate) &&
      passesDistanceFilter(run, filters.distance)
    ) {
      filteredRunIds.push(runId)
    }
  }

  return filteredRunIds
}

// Given a run object and a startDate and endDate as Luxon DateTime objects,
// Returns true iff the run starts between the startDate and endDate.
const passesDateFilter = (run, startDate, endDate) => {
  const startDT = DateTime.fromISO(startDate)
  const endDT = DateTime.fromISO(endDate)

  // Neither defined means it passes!
  if (!startDT.isValid && !endDT.isValid) {
    return true
  }

  // UX decision: User must select startDate before endDate (can't only select an endDate)
  if (!startDT.isValid && endDT.isValid) {
    throw new Error(
      'Error in passesDateFilter: endDate filter must have a startDate filter value!'
    )
  }

  if (run == null) {
    throw new Error('Error in passesDateFilter: run is required.')
  }

  const tz = run.timezone.split(' ')[1]
  const runDT = DateTime.fromISO(run.startDate, { zone: tz })

  if (!runDT.isValid) {
    throw new Error(
      'Error in passesDateFilter: run.startDate must be a valid date.'
    )
  }

  // Both defined => run must be between
  if (startDT.isValid && endDT.isValid) {
    return startDT <= runDT && runDT <= endDT
  }

  // Start date defined => exact date match
  if (startDT.isValid && !endDT.isValid) {
    return startDT.toISODate() === runDT.toISODate()
  }

  return true
}

const DISTANCE_FIILTER_MATCH_TYPE_VALUES = [
  'Between',
  'Less Than',
  'More Than',
  'Exactly',
]

const passesDistanceFilter = (run, distanceFilters) => {
  // If main value (min) is not set, just ignore this filter altogether
  if (distanceFilters.value === initialState.runs.filters.distance.value) {
    return true
  }

  const runDistance = Number(formatActualMileage(run.distance))

  switch (distanceFilters.matchType) {
    // Between
    case DISTANCE_FIILTER_MATCH_TYPE_VALUES[0]: {
      return (
        distanceFilters.value <= runDistance &&
        runDistance <= distanceFilters.maxValue
      )
    }

    // Less Than
    case DISTANCE_FIILTER_MATCH_TYPE_VALUES[1]: {
      return runDistance < distanceFilters.value
    }

    // More Than
    case DISTANCE_FIILTER_MATCH_TYPE_VALUES[2]: {
      return runDistance > distanceFilters.value
    }

    // Exactly
    case DISTANCE_FIILTER_MATCH_TYPE_VALUES[3]: {
      return formatActualMileage(run.distance) === distanceFilters.value
    }

    default: {
      throw new Error(
        'Error in passesDistanceFilter: distance matchType must be one of the following values: ${DISTANCE_FIILTER_MATCH_TYPE_VALUES}'
      )
    }
  }
}

export { getFilteredRunIds }
