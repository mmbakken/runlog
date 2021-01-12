import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../styles/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname

  const HOME_PATH = '/'
  const CALENDAR_PATH = '/calendar'
  const LIST_PATH = '/list'
  const LOGIN_PATH = '/login'

  return (
    <nav className='Navbar'>
      <ul>
        <li className={currentPath === HOME_PATH ? 'active' : null}>
          <Link to={HOME_PATH}>Home</Link>
        </li>
        <li className={currentPath === CALENDAR_PATH ? 'active' : null}>
          <Link to={CALENDAR_PATH}>Calendar</Link>
        </li>
        <li className={currentPath === LIST_PATH ? 'active' : null}>
          <Link to={LIST_PATH}>List</Link>
        </li>
        <li className={currentPath === LOGIN_PATH ? 'active' : null}>
          <Link to={LOGIN_PATH}>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
