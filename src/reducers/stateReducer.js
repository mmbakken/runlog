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
          isSendingEdit: true,
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
          isSendingEdit: false,
        },
      }
    }

    case actions.EDIT_RUN__ERROR: {
      return {
        ...state,
        runs: {
          ...state.runs,
          error: action.error,
          isSendingEdit: false,
        },
      }
    }

    ////////
    // Daily Stats GET actions
    ////////

    case actions.GET_ALL_DAILY_STATS__START: {
      return {
        ...state,
        dailyStats: {
          ...state.dailyStats,
          isFetching: true,
        },
      }
    }

    case actions.GET_ALL_DAILY_STATS__SUCCESS: {
      return {
        ...state,
        dailyStats: {
          ...state.dailyStats,
          isFetching: false,
          byId: action.dailyStats,
          error: null,
        },
      }
    }

    case actions.GET_ALL_DAILY_STATS__ERROR: {
      return {
        ...state,
        dailyStats: {
          ...state.dailyStats,
          isFetching: false,
          error: action.error,
        },
      }
    }

    ////////
    // Training Plans GET actions
    ////////

    case actions.GET_ALL_TRAINING__START: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: true,
        },
      }
    }

    case actions.GET_ALL_TRAINING__SUCCESS: {
      const ids = Object.keys(action.data)
      let trainingById = {}

      for (let i = 0; i < ids.length; i++) {
        trainingById[ids[i]] = { ...action.data[ids[i]] }
      }

      const returnObj = {
        ...state,
        training: {
          ...state.training,
          isFetching: false,
          byId: trainingById, // Just replace all training objects with newly retrieved data
          allIds: ids,
          error: null,
        },
      }

      return returnObj
    }

    case actions.GET_ALL_TRAINING__ERROR: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: false,
          error: action.error,
        },
      }
    }

    case actions.GET_TRAINING_PLAN__START: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: true,
        },
      }
    }
    case actions.GET_TRAINING_PLAN__SUCCESS: {
      const trainingById = {
        ...state.training.byId,
        [action.plan._id]: action.plan,
      }

      const allIds = Object.keys(trainingById)

      const returnObj = {
        ...state,
        training: {
          ...state.training,
          isFetching: false,
          byId: trainingById, // Just replace all training objects with newly retrieved data
          allIds: allIds,
          error: null,
        },
      }

      return returnObj
    }

    case actions.GET_TRAINING_PLAN__ERROR: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: false,
          error: action.error,
        },
      }
    }

    case actions.CREATE_TRAINING_PLAN__START: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: true,
        },
      }
    }

    case actions.CREATE_TRAINING_PLAN__SUCCESS: {
      const trainingById = {
        ...state.training.byId,
        [action.plan._id]: action.plan,
      }
      const allIds = Object.keys(trainingById)
      const returnObj = {
        ...state,
        training: {
          ...state.training,
          byId: trainingById,
          allIds: allIds,
          error: null,
        },
      }

      return returnObj
    }

    case actions.CREATE_TRAINING_PLAN__ERROR: {
      return {
        ...state,
        training: {
          ...state.training,
          isFetching: false,
        },
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default stateReducer
