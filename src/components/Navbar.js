import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'

import {
  HomeRoute,
  CalendarRoute,
  ListRoute,
  LoginRoute,
  AccountRoute,
} from '../constants/routes'

import '../styles/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const history = useHistory()
  const [auth, authDispatch] = useContext(AuthContext)

  // Delete the user token and reset auth state
  const logout = () => {
    localStorage.removeItem('token')
    authDispatch({
      type: actions.LOGOUT,
    })
    history.push(HomeRoute)
  }

  return (
    <nav className='Navbar'>
      <ul>
        <li className={currentPath === HomeRoute ? 'active' : null}>
          <Link to={HomeRoute}>Home</Link>
        </li>
        <li className={currentPath === CalendarRoute ? 'active' : null}>
          <Link to={CalendarRoute}>Calendar</Link>
        </li>
        <li className={currentPath === ListRoute ? 'active' : null}>
          <Link to={ListRoute}>List</Link>
        </li>

        {!auth.isLoggedIn && (
          <li className={currentPath === LoginRoute ? 'active' : null}>
            <Link to={LoginRoute}>Login</Link>
          </li>
        )}

        {auth.isLoggedIn && (
          <>
            <li className={currentPath === AccountRoute ? 'active' : null}>
              <Link to={AccountRoute}>Account</Link>
            </li>
            <li>
              <a onClick={logout}>Logout</a>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
