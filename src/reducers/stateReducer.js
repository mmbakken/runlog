import actions from './actions'

const stateReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_ALL_RUNS__START: {
      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: true,
        },
      }
    }

    case actions.GET_ALL_RUNS__SUCCESS: {
      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: false,
          byId: action.runs,
          error: null,
        },
      }
    }

    case actions.GET_ALL_RUNS__ERROR: {
      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: false,
        },
      }
    }

    case actions.GET_RUN__START: {
      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: true,
        },
      }
    }

    case actions.GET_RUN__SUCCESS: {
      const newRuns = {}

      // Copy the map of the current state's run objects.
      for (let runId of Object.keys(state.runs)) {
        newRuns[runId] = action.run
      }

      // Always overwrite this run object in the cloned map
      newRuns[action.run._id] = action.run

      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: false,
          byId: newRuns,
          error: null,
        },
      }
    }

    case actions.GET_RUN__ERROR: {
      return {
        ...state,
        runs: {
          ...state.runs,
          isFetching: false,
          error: action.error,
        },
      }
    }

    case actions.EDIT_RUN__START: {
      return {
        ...state,
        runs: {
          ...state.runs,
        },
      }
    }

    case actions.EDIT_RUN__SUCCESS: {
      const newRuns = {}

      // Copy the map of the current state's run objects.
      for (let runId of Object.keys(state.runs)) {
        newRuns[runId] = action.run
      }

      // Always overwrite this run object in the cloned map
      newRuns[action.run._id] = action.run

      return {
        ...state,
        runs: {
          ...state.runs,
          byId: newRuns,
          error: null,
        },
      }
    }

    case actions.EDIT_RUN__ERROR: {
      return {
        ...state,
        runs: {
          ...state.runs,
          error: action.error,
        },
      }
    }

    default: {
      throw new Error(`No run action of type: "${action.type}"`)
    }
  }
}

export default stateReducer
