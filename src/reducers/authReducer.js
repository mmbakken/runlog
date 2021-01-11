import actions from './actions'

const authReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER: {
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
        isLoggingIn: false,
      }
    }

    case actions.LOGIN__START: {
      return {
        ...state,
        isLoggingIn: true,
      }
    }

    case actions.LOGIN__SUCCESS: {
      return {
        ...state,
        user: action.user,
        isLoggedIn: true,
        isLoggingIn: false,
      }
    }

    case actions.LOGIN__ERROR: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoggingIn: false,
      }
    }

    case actions.LOGOUT: {
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoggingIn: false,
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default authReducer
