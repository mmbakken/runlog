import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LoginRoute } from '../../constants/routes'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
  const auth = useContext(AuthContext)[0]

  // Don't load the /login page before we're had a chance to determine if the user is
  // already logged in!
  if (auth.checkingJWT) {
    return null
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LoginRoute,
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired,
}

export default PrivateRoute
