import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  HomeRoute,
  CalendarRoute,
  ListRoute,
  LoginRoute,
} from '../constants/routes'

import '../styles/Navbar.css'

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname

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
        <li className={currentPath === LoginRoute ? 'active' : null}>
          <Link to={LoginRoute}>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
