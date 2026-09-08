import actions from './actions'
import userReducer from './userReducer'

const authReducer = (state, action) => {
  switch (action.type) {
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

    case actions.GET_USER__START:
    case actions.GET_USER__SUCCESS:
    case actions.GET_USER__ERROR: {
      return {
        ...state,
        ...userReducer(state.user, action),
      }
    }

    default: {
      throw new Error(`No auth action of type: "${action.type}"`)
    }
  }
}

export default authReducer
