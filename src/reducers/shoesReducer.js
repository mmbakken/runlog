import actions from './actions'

const shoesReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_ALL_SHOES__START: {
      return {
        ...state,
        byId: state.byId,
        error: null,
        isFetching: true,
      }
    }

    case actions.GET_ALL_SHOES__SUCCESS: {
      return {
        ...state,
        isFetching: false,
        byId: action.shoes,
        error: null,
      }
    }

    case actions.GET_ALL_SHOES__ERROR: {
      return {
        ...state,
        isFetching: false,
      }
    }

    case actions.CREATE_SHOES__START: {
      return state
    }

    case actions.CREATE_SHOES__SUCCESS: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.shoe._id]: action.shoe,
        },
        error: null,
      }
    }

    case actions.CREATE_SHOES__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    case actions.DELETE_SHOES__START: {
      return state
    }

    case actions.DELETE_SHOES__SUCCESS: {
      let currentMap = {
        ...state.byId,
      }

      delete currentMap[action.shoe._id]

      return {
        ...state,
        byId: currentMap,
        error: null,
      }
    }

    case actions.DELETE_SHOES__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default shoesReducer
