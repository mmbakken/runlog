import React from 'react'
import {
  Link
} from 'react-router-dom'

import '../styles/Navbar.css'

const Navbar = () => {
  return (
    <nav className='Navbar'>
      <ul>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/calendar'>Calendar</Link>
        </li>
        <li>
          <Link to='/list'>List</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
