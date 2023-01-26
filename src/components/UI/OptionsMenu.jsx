import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

// Displays a pop-up context menu
const OptionsMenu = ({ isVisible, hide, children }) => {
  if (!isVisible) {
    return null
  }

  useEffect(() => {
    // Allow user to hide the option menu with ESC key or a click outside of the menu
    const handleEscPress = (event) => {
      if (event.keyCode === 27) {
        hide()
      }
    }

    window.addEventListener('keydown', handleEscPress)

    // Unregister listeners on dismount
    return () => {
      window.removeEventListener('keydown', handleEscPress)
    }
  }, [])

  const onMaskClick = (e) => {
    e.preventDefault()
    hide()
  }

  let menuClasses =
    'w-full absolute left-0 text-left drop-shadow-lg border rounded border-gray-900 bg-offwhite-100 z-50 font-normal text-base'
  let maskClasses =
    'fixed w-full h-full z-40 bg-gray-900 opacity-10 top-0 left-0'
  if (isVisible) {
    menuClasses += ' block'
    maskClasses += ' block'
  } else {
    menuClasses += ' hidden'
    maskClasses += ' hidden'
  }

  return (
    <>
      <div className={menuClasses}>
        <ul className='w-full flex flex-col'>{children}</ul>
      </div>

      <div
        className={maskClasses}
        onClick={(e) => {
          onMaskClick(e)
        }}
      ></div>
    </>
  )
}

OptionsMenu.propTypes = {
  isVisible: PropTypes.bool,
  hide: PropTypes.func,
  children: PropTypes.node,
}

export default OptionsMenu
