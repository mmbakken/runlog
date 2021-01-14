import actions from './actions'

const authReducer = (state, action) => {
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

    case actions.LOGIN__START: {
      return {
        ...state,
        isLoggingIn: true,
        checkingJWT: false,
      }
    }

    case actions.LOGIN__SUCCESS: {
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
        isLoggingIn: false,
        checkingJWT: false,
      }
    }

    case actions.LOGIN__ERROR: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoggingIn: false,
        checkingJWT: false,
      }
    }

    case actions.LOGOUT: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoggingIn: false,
        checkingJWT: false,
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default authReducer
