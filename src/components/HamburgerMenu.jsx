import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

import {
  HomeRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
  LoginRoute,
  AccountRoute,
} from '../constants/routes'

const HamburgerMenu = ({ isLoggedIn, logout }) => {
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)

  const onMenuClick = () => {
    setIsOpen(!isOpen)
  }

  const onLinkClick = (route) => {
    history.push(route)
    setIsOpen(false)
  }

  const onLogoutClick = () => {
    setIsOpen(false)
    logout()
  }

  return (
    <div className='sm:hidden flex w-full'>
      <div className='flex relative items-center space-x-2'>
        <span onClick={onMenuClick} className='px-4'>
          {isOpen && (
            <FontAwesomeIcon
              className='text-2xl w-6 cursor-pointer'
              icon={faTimes}
            />
          )}

          {!isOpen && (
            <FontAwesomeIcon
              className='text-2xl w-6 cursor-pointer'
              icon={faBars}
            />
          )}
        </span>

        <span
          className='cursor-pointer'
          onClick={() => {
            onLinkClick(HomeRoute)
          }}
        >
          <header>
            <h1 className='font-heading pb-2 text-4xl'>runlog</h1>
          </header>
        </span>
      </div>

      {isOpen && (
        <ul className='z-50 flex flex-col absolute top-20 bottom-0 left-0 right-0 text-lg bg-offwhite-100 border-t-2 border-eggplant-700'>
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
  logout: PropTypes.func.isRequired,
}

export default HamburgerMenu