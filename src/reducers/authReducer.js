import actions from './actions'

const authReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_TOKEN: {
      return {
        ...state,
        token: action.token,
        isLoggedIn: true,
        isLoggingIn: false,
        // TODO: How to get user info if the ID is already saved?
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
        token: action.token,
        isLoggedIn: false,
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
        token: null,
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
