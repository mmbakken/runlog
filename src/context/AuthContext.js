import React, { useReducer, createContext } from 'react'
import PropTypes from 'prop-types'
import initialState from '../reducers/initialState'
import authReducer from '../reducers/authReducer'

export const AuthContext = createContext()

export const AuthContextProvider = (props) => {
  const [auth, authDispatch] = useReducer(authReducer, initialState.auth)

  return (
    <AuthContext.Provider value={[auth, authDispatch]}>
      {props.children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}
