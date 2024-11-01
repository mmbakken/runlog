import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'
import { StateContext } from '../context/StateContext'

import HamburgerMenu from './HamburgerMenu'

import {
  HomeRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
  LoginRoute,
  AccountRoute,
} from 'app/routes'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()
  const [auth, authDispatch] = useContext(AuthContext)
  const stateDispatch = useContext(StateContext)[1]

  // Delete the user token and reset auth state
  const logout = () => {
    localStorage.removeItem('token')
    authDispatch({
      type: actions.LOGOUT,
    })
    stateDispatch({
      type: actions.LOGOUT,
    })
    navigate(HomeRoute)
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
    <nav className='Navbar h-20 py-4'>
      <HamburgerMenu
        logout={logout}
        isLoggedIn={auth.isLoggedIn}
        isHomeRoute={isHomeRoute}
      />

      <div className='hidden justify-between text-lg sm:flex'>
        <ul className='inline-flex items-center space-x-4'>
          {isHomeRoute ? null : (
            <li>
              <Link to={HomeRoute}>
                <header>
                  <h1 className='px-4 pb-2 font-heading text-4xl'>runlog</h1>
                </header>
              </Link>
            </li>
          )}

          <li
            className={
              trainingClasses +
              ' mt-2 border-b-2 leading-snug hover:border-eggplant-700'
            }
          >
            <Link to={AllTrainingPlansRoute}>Training</Link>
          </li>

          <li
            className={
              runsClasses +
              ' mt-2 border-b-2 leading-snug hover:border-eggplant-700'
            }
          >
            <Link to={AllRunsRoute}>Runs</Link>
          </li>

          {auth.isLoggedIn && (
            <li
              className={
                accountClasses +
                ' mt-2 border-b-2 leading-snug hover:border-eggplant-700'
              }
            >
              <Link to={AccountRoute}>Account</Link>
            </li>
          )}
        </ul>

        <ul className='mr-4 inline-flex items-center space-x-4'>
          {!auth.isLoggedIn && (
            <li
              className={
                loginClasses +
                ' mt-2 border-b-2 border-transparent leading-snug hover:border-eggplant-700'
              }
            >
              <Link to={LoginRoute}>Login</Link>
            </li>
          )}

          {auth.isLoggedIn && (
            <li className='mt-2 cursor-pointer border-b-2 border-transparent leading-snug hover:border-eggplant-700'>
              <a onClick={logout}>Logout</a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
