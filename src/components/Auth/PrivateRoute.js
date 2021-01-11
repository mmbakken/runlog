import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Redirect,
} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext)[0]

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired
}

export default PrivateRoute
