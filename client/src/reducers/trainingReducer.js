import actions from './actions'

const trainingReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_ALL_TRAINING__START: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case actions.GET_ALL_TRAINING__SUCCESS: {
      const ids = Object.keys(action.data)
      let trainingById = {}

      for (let i = 0; i < ids.length; i++) {
        trainingById[ids[i]] = { ...action.data[ids[i]] }
      }

      return {
        ...state,
        isFetching: false,
        byId: trainingById, // Just replace all training objects with newly retrieved data
        allIds: ids,
        error: null,
      }
    }

    case actions.GET_ALL_TRAINING__ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    }

    case actions.GET_TRAINING_PLAN__START: {
      return {
        ...state,
        isFetching: true,
      }
    }
    case actions.GET_TRAINING_PLAN__SUCCESS: {
      const trainingById = {
        ...state.byId,
        [action.plan._id]: action.plan,
      }

      const allIds = Object.keys(trainingById)

      return {
        ...state,
        isFetching: false,
        byId: trainingById, // Just replace all training objects with newly retrieved data
        allIds: allIds,
        error: null,
      }
    }

    case actions.GET_TRAINING_PLAN__ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    }

    case actions.CREATE_TRAINING_PLAN__START: {
      return {
        ...state,
        isFetching: true,
      }
    }

    case actions.CREATE_TRAINING_PLAN__SUCCESS: {
      const trainingById = {
        ...state.byId,
        [action.plan._id]: action.plan,
      }
      const allIds = Object.keys(trainingById)

      return {
        ...state,
        byId: trainingById,
        allIds: allIds,
        error: null,
      }
    }

    case actions.CREATE_TRAINING_PLAN__ERROR: {
      return {
        ...state,
        isFetching: false,
      }
    }

    case actions.UPDATE_TRAINING_PLAN__START: {
      return {
        ...state,
        error: null,
      }
    }

    case actions.UPDATE_TRAINING_PLAN__SUCCESS: {
      const trainingById = {
        ...state.byId,
        [action.plan._id]: action.plan,
      }

      return {
        ...state,
        byId: trainingById,
        error: null,
      }
    }

    case actions.UPDATE_TRAINING_PLAN__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    case actions.UPDATE_TRAINING_PLAN_DATE__START: {
      return {
        ...state,
      }
    }

    case actions.UPDATE_TRAINING_PLAN_DATE__SUCCESS: {
      const trainingById = {
        ...state.byId,
        [action.plan._id]: action.plan,
      }

      return {
        ...state,
        byId: trainingById,
        error: null,
      }
    }

    case actions.UPDATE_TRAINING_PLAN_DATE__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    case actions.DELETE_TRAINING__START: {
      return {
        ...state,
        isFetching: false,
      }
    }

    case actions.DELETE_TRAINING__SUCCESS: {
      delete state.byId[action.id]

      return {
        ...state,
        isFetching: false,
        error: null,
        byId: state.byId,
        allIds: Object.keys(state.byId),
      }
    }

    case actions.DELETE_TRAINING__ERROR: {
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    }
  }
}

export default trainingReducer
