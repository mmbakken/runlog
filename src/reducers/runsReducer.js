import { DateTime } from 'luxon'
import actions from './actions'
import initialState from './initialState'

// Given the runs by their id mapping and a filter object,
// Returns an array of run._id strings that pass the filters.
const getFilteredRunIds = (runsById, filters) => {
  const filteredRunIds = []

  for (let runId of Object.keys(runsById)) {
    let run = runsById[runId]

    // If this run passes the filters, include it in the results array
    if (passesDateFilter(run, filters.startDate, filters.endDate)) {
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
      'Error in passesFilter: endDate filter must have a startDate filter value!'
    )
  }

  if (run == null) {
    throw new Error('Error in passesFilter: run is required.')
  }

  const tz = run.timezone.split(' ')[1]
  const runDT = DateTime.fromISO(run.startDate, { zone: tz })

  if (!runDT.isValid) {
    throw new Error(
      'Error in passesFilter: run.startDate must be a valid date.'
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

const runsReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_ALL_RUNS__START: {
      return {
        ...state,
        byId: state.byId,
        error: null,
        isFetching: true,
      }
    }

    case actions.GET_ALL_RUNS__SUCCESS: {
      return {
        ...state,
        isFetching: false,
        byId: action.runs,
        filteredIds: Object.keys(action.runs),
        filters: initialState.runs.filters,
        error: null,
      }
    }

    case actions.GET_ALL_RUNS__ERROR: {
      return {
        ...state,
        isFetching: false,
      }
    }

    case actions.GET_RUN__START: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case actions.GET_RUN__SUCCESS: {
      // Deep copy the map of the current state's run objects.
      const newRunsById = JSON.parse(JSON.stringify(state.byId))

      // Overwrite the newly fetched run object in the new map
      newRunsById[action.run._id] = action.run

      return {
        ...state,
        isFetching: false,
        byId: newRunsById,
        error: null,
      }
    }

    case actions.GET_RUN__ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    }

    case actions.EDIT_RUN__START: {
      return {
        ...state,
        isSendingEdit: true,
      }
    }

    case actions.EDIT_RUN__SUCCESS: {
      const newRuns = {}

      // Copy the map of the current state's run objects.
      for (let runId of Object.keys(state)) {
        newRuns[runId] = action.run
      }

      // Always overwrite this run object in the cloned map
      newRuns[action.run._id] = action.run

      return {
        ...state,
        byId: newRuns,
        error: null,
        isSendingEdit: false,
      }
    }

    case actions.EDIT_RUN__ERROR: {
      return {
        ...state,
        error: action.error,
        isSendingEdit: false,
      }
    }

    case actions.DELETE_RUN__START: {
      return {
        ...state,
        isDeleting: true,
      }
    }

    case actions.DELETE_RUN__SUCCESS: {
      const newRuns = {}

      // Copy the map of the current state's run objects, except the deleted run
      for (let runId of Object.keys(state)) {
        if (runId !== action.runId) {
          newRuns[runId] = state.byId[runId]
        }
      }

      return {
        ...state,
        byId: newRuns,
        error: null,
        isDeleting: false,
      }
    }

    case actions.DELETE_RUN__ERROR: {
      return {
        ...state,
        error: action.error,
        isDeleting: false,
      }
    }

    case actions.SET_RUN_FILTERS__START_DATE: {
      const newFilters = {
        ...state.filters,
        startDate: action.startDate,
      }

      return {
        ...state,
        filteredIds: getFilteredRunIds(state.byId, newFilters),
        filters: newFilters,
      }
    }

    case actions.SET_RUN_FILTERS__END_DATE: {
      const newFilters = {
        ...state.filters,
        startDate: state.filters.startDate,
        endDate: action.endDate,
      }

      return {
        ...state,
        filteredIds: getFilteredRunIds(state.byId, newFilters),
        filters: newFilters,
      }
    }

    case actions.CLEAR_RUN_FILTERS__START_DATE: {
      const newFilters = {
        ...state.filters,
        startDate: initialState.runs.filters.startDate,
        endDate: initialState.runs.filters.endDate,
      }

      return {
        ...state,
        filteredIds: getFilteredRunIds(state.byId, newFilters),
        filters: newFilters,
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default runsReducer
