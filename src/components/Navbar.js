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
  const calendarClasses =
    currentPath === CalendarRoute ? 'border-eggplant-700' : ''
  const listClasses = currentPath === ListRoute ? 'border-eggplant-700' : ''
  const loginClasses = currentPath === LoginRoute ? 'border-eggplant-700' : ''
  const accountClasses =
    currentPath === AccountRoute ? 'border-eggplant-700' : ''

  return (
    <nav className='Navbar mb-4 mt-2'>
      <div className='flex justify-between text-lg'>
        <ul className='inline-flex items-center space-x-4 '>
          <li>
            <Link to={HomeRoute}>
              <header>
                <h1 className='font-heading px-4 pb-2 text-4xl'>runlog</h1>
              </header>
            </Link>
          </li>

          <li
            className={
              'mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700 ' +
              calendarClasses
            }
          >
            <Link to={CalendarRoute}>Calendar</Link>
          </li>

          <li
            className={
              'mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700 ' +
              listClasses
            }
          >
            <Link to={ListRoute}>Runs</Link>
          </li>

          {auth.isLoggedIn && (
            <li
              className={
                'mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700 ' +
                accountClasses
              }
            >
              <Link to={AccountRoute}>Account</Link>
            </li>
          )}
        </ul>

        <ul className='inline-flex items-center space-x-4 mr-4'>
          {!auth.isLoggedIn && (
            <li
              className={
                'mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700 ' +
                loginClasses
              }
            >
              <Link to={LoginRoute}>Login</Link>
            </li>
          )}

          {auth.isLoggedIn && (
            <li className='cursor-pointer mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700'>
              <a onClick={logout}>Logout</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
