import actions from './actions'

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

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default runsReducer
