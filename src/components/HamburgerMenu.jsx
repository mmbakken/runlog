import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

import {
  HomeRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
  LoginRoute,
  AccountRoute,
} from 'app/routes'

const HamburgerMenu = ({ isLoggedIn, logout, isHomeRoute }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const onMenuClick = () => {
    setIsOpen(!isOpen)
  }

  const onLinkClick = (route) => {
    navigate(route)
    setIsOpen(false)
  }

  const onLogoutClick = () => {
    setIsOpen(false)
    logout()
  }

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  // When the menu is open, do not allow scrolling on covered page
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
  }, [isOpen])

  return (
    <div className='flex w-full h-full sm:hidden bg-transparent'>
      <div className='flex relative items-center space-x-2 cursor-pointer'>
        <span onClick={onMenuClick} className='px-4'>
          {isOpen && (
            <FontAwesomeIcon className='text-2xl mt-1 w-6' icon={faTimes} />
          )}

          {!isOpen && (
            <FontAwesomeIcon className='text-2xl mt-1 w-6' icon={faBars} />
          )}
        </span>

        {!isHomeRoute || isOpen ? (
          <header
            onClick={() => {
              onLinkClick(HomeRoute)
            }}
          >
            <h1 className='font-heading pb-2 text-4xl'>runlog</h1>
          </header>
        ) : null}
      </div>

      {isOpen && (
        <ul className='z-50 flex flex-col fixed top-20 bottom-0 left-0 right-0 text-lg bg-neutral-800 border-t-2 border-eggplant-700'>
          <li
            className={'cursor-pointer border-b border-gray-300 px-4 py-4'}
            onClick={() => {
              onLinkClick(HomeRoute)
            }}
          >
            Home
          </li>

          <li
            className={'cursor-pointer border-b border-gray-300 px-4 py-4'}
            onClick={() => {
              onLinkClick(AllTrainingPlansRoute)
            }}
          >
            Training
          </li>

          <li
            className={'cursor-pointer border-b border-gray-300 px-4 py-4'}
            onClick={() => {
              onLinkClick(AllRunsRoute)
            }}
          >
            Runs
          </li>

          {isLoggedIn && (
            <>
              <li
                className={'cursor-pointer border-b border-gray-300 px-4 py-4'}
                onClick={() => {
                  onLinkClick(AccountRoute)
                }}
              >
                Account
              </li>

              <li
                className='cursor-pointer border-b border-gray-300 px-4 py-4'
                onClick={onLogoutClick}
              >
                Logout
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li
              className={'border-b border-gray-300 px-4 py-4'}
              onClick={() => {
                onLinkClick(LoginRoute)
              }}
            >
              Log In
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

HamburgerMenu.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isHomeRoute: PropTypes.bool,
  logout: PropTypes.func.isRequired,
}

export default HamburgerMenu
