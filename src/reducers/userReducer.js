import actions from './actions'

const userReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_USER__START: {
      return {
        ...state,
        isLoggingIn: false,
      }
    }

    case actions.GET_USER__SUCCESS: {
      return {
        ...state,
        user: action.user,
        isLoggingIn: false,
        isLoggedIn: true,
        checkingJWT: false,
      }
    }

    case actions.GET_USER__ERROR: {
      return {
        ...state,
        user: null,
        isLoggingIn: false,
        isLoggedIn: false,
        checkingJWT: false,
      }
    }

    case actions.CREATE_USER_GEAR__START: {
      return state
    }

    case actions.CREATE_USER_GEAR__SUCCESS: {
      return {
        ...state,
        user: action.user,
        error: null,
      }
    }

    case actions.CREATE_USER_GEAR__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    case actions.DELETE_USER_GEAR__START: {
      return state
    }

    case actions.DELETE_USER_GEAR__SUCCESS: {
      return {
        ...state,
        user: action.user,
        error: null,
      }
    }

    case actions.DELETE_USER_GEAR__ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }

    default: {
      throw new Error(`No user action of type ${action.type}`)
    }
  }
}

export default userReducer
