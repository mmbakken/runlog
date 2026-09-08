import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const RequireAuth = ({ children, redirectTo }) => {
  const auth = useContext(AuthContext)[0]

  // Don't load the login page before we're had a chance to determine if the
  // user is already logged in!
  if (auth.checkingJWT) {
    return null
  }

  return auth.isLoggedIn ? children : <Navigate to={redirectTo} />
}

export default RequireAuth
