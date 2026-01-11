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
    <div className='flex h-full w-full bg-transparent sm:hidden'>
      <div className='relative flex cursor-pointer items-center space-x-2'>
        <span onClick={onMenuClick} className='px-4'>
          {isOpen && (
            <FontAwesomeIcon className='mt-1 w-6 text-2xl' icon={faTimes} />
          )}

          {!isOpen && (
            <FontAwesomeIcon className='mt-1 w-6 text-2xl' icon={faBars} />
          )}
        </span>

        {!isHomeRoute || isOpen ? (
          <header
            onClick={() => {
              onLinkClick(HomeRoute)
            }}
          >
            <h1 className='pb-2 font-heading text-4xl'>runlog</h1>
          </header>
        ) : null}
      </div>

      {isOpen && (
        <ul className='fixed top-20 right-0 bottom-0 left-0 z-50 flex flex-col border-t-2 border-eggplant-700 bg-neutral-800 text-lg'>
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
