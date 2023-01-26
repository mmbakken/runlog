import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import useOutsideClickHandler from '../../UI/useOutsideClickHandler'

// Displays a pop-up context menu
const OptionsMenu = ({
  isVisible,
  hide,
  options,
  onSelect,
  activeOption,
  buttonRef,
}) => {
  if (!isVisible) {
    return null
  }

  const menuRef = useRef(null)
  useOutsideClickHandler([menuRef, buttonRef], hide)

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

  let menuClasses =
    'absolute left-0 w-full font-normal text-base text-left drop-shadow-lg border rounded-b border-gray-900 bg-offwhite-100 z-50'

  menuClasses += isVisible ? ' block' : ' hidden'

  return (
    <div ref={menuRef} className={menuClasses}>
      <ul className='w-full flex flex-col'>
        {options.map((categoryName, index) => {
          const isActiveCategory = activeOption === index
          const optionClasses = `${
            isActiveCategory ? 'bg-eggplant-700 text-white ' : ''
          } w-full text-sm px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition`

          return (
            <li
              key={index}
              tabIndex='0'
              className={optionClasses}
              onClick={() => {
                onSelect(index)
              }}
            >
              {categoryName}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

OptionsMenu.propTypes = {
  isVisible: PropTypes.bool,
  hide: PropTypes.func,
  options: PropTypes.array,
  onSelect: PropTypes.func,
  activeOption: PropTypes.number,
  buttonRef: PropTypes.node,
}

export default OptionsMenu
