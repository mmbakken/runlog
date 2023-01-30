import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'

import HamburgerMenu from './HamburgerMenu'

import {
  HomeRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
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

  const routeBasePath = currentPath.substr(1).split('/')[0]

  // Set up the class names for each link item
  let trainingClasses =
    routeBasePath === 'training' ? 'border-eggplant-700' : 'border-transparent'
  const runsClasses =
    routeBasePath === 'runs' ? 'border-eggplant-700' : 'border-transparent'
  const loginClasses =
    routeBasePath === 'login' ? 'border-eggplant-700' : 'border-transparent'
  const accountClasses =
    routeBasePath === 'account' ? 'border-eggplant-700' : 'border-transparent'

  const isHomeRoute = routeBasePath === ''

  if (isHomeRoute) {
    trainingClasses += ' ml-4'
  }

  return (
    <nav className='Navbar py-4 h-20'>
      <HamburgerMenu
        logout={logout}
        isLoggedIn={auth.isLoggedIn}
        isHomeRoute={isHomeRoute}
      />

      <div className='hidden sm:flex justify-between text-lg'>
        <ul className='inline-flex items-center space-x-4 '>
          {isHomeRoute ? null : (
            <li>
              <Link to={HomeRoute}>
                <header>
                  <h1 className='font-heading px-4 pb-2 text-4xl'>runlog</h1>
                </header>
              </Link>
            </li>
          )}

          <li
            className={
              trainingClasses +
              ' mt-2 leading-snug border-b-2 hover:border-eggplant-700'
            }
          >
            <Link to={AllTrainingPlansRoute}>Training</Link>
          </li>

          <li
            className={
              runsClasses +
              ' mt-2 leading-snug border-b-2 hover:border-eggplant-700'
            }
          >
            <Link to={AllRunsRoute}>Runs</Link>
          </li>

          {auth.isLoggedIn && (
            <li
              className={
                accountClasses +
                ' mt-2 leading-snug border-b-2 hover:border-eggplant-700'
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
                loginClasses +
                ' mt-2 leading-snug border-b-2 border-transparent hover:border-eggplant-700'
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
