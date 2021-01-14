import React, { useReducer, createContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import initialState from '../reducers/initialState'
import authReducer from '../reducers/authReducer'
import actions from '../reducers/actions'
import { APIv1, setAuthHeader } from '../api'

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  const [auth, authDispatch] = useReducer(authReducer, initialState.auth)

  useEffect(() => {
    // Check for a JWT, and save it to the AuthContext if set
    const token = localStorage.getItem('token')

    if (token != null) {
      // Add the token to the API instance
      setAuthHeader(token)

      authDispatch({
        type: actions.GET_USER__START,
      })

      // Go get the user information from the token
      APIv1.get('/user')
        .then((response) => {
          // Then save the user info to auth state
          authDispatch({
            type: actions.GET_USER__SUCCESS,
            user: response.data.user,
          })
        })
        .catch((error) => {
          console.error(error)
          authDispatch({
            type: actions.GET_USER__ERROR,
          })
        })
    } else {
      // Reset the checkingJWT flag to false
      authDispatch({
        type: actions.LOGOUT,
      })
    }
  }, [])

  return (
    <AuthContext.Provider value={[auth, authDispatch]}>
      {props.children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
