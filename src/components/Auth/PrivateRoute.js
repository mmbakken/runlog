import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { LoginRoute } from '../../constants/routes'
import actions from '../../reducers/actions'
import { APIv1, setAuthHeader } from '../../api'

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
  const [auth, authDispatch] = useContext(AuthContext)

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
    }
  }, [auth.checkingJWT])

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
