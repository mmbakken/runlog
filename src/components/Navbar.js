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

  // Set up the class names for each link item
  const calendarClasses = currentPath === CalendarRoute ? 'underline' : null
  const listClasses = currentPath === ListRoute ? 'underline' : null
  const loginClasses = currentPath === LoginRoute ? 'underline' : null
  const accountClasses = currentPath === AccountRoute ? 'underline' : null

  return (
    <nav className='Navbar mb-4 mt-2'>
      <ul className='inline-flex items-center space-x-4 text-lg'>
        <li>
          <Link to={HomeRoute}>
            <header>
              <h1 className='font-heading px-4 pb-2 text-4xl'>runlog</h1>
            </header>
          </Link>
        </li>

        <li className={'hover:underline ' + calendarClasses}>
          <Link to={CalendarRoute}>Calendar</Link>
        </li>

        <li className={'hover:underline ' + listClasses}>
          <Link to={ListRoute}>List</Link>
        </li>

        {!auth.isLoggedIn && (
          <li className={'hover:underline ' + loginClasses}>
            <Link to={LoginRoute}>Login</Link>
          </li>
        )}

        {auth.isLoggedIn && (
          <>
            <li className={'hover:underline ' + accountClasses}>
              <Link to={AccountRoute}>Account</Link>
            </li>
            <li>
              <a className='cursor-pointer hover:underline' onClick={logout}>
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
