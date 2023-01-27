import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import useOutsideClickHandler from '../../UI/useOutsideClickHandler'

// Displays a pop-up context menu
const OptionsMenu = ({
  isVisible,
  hide,
  options,
  onSelect,
  activeOption,
  containerRef,
}) => {
  if (!isVisible) {
    return null
  }

  useOutsideClickHandler(containerRef, hide)

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
    'absolute left-0 w-full font-normal text-base text-left drop-shadow-lg border rounded-b border-neutral-500 bg-neutral-700 z-50'

  menuClasses += isVisible ? ' block' : ' hidden'

  return (
    <div className={menuClasses}>
      <ul className='w-full flex flex-col'>
        {options.map((categoryName, index) => {
          const isActiveCategory = activeOption === index
          const optionClasses = `${
            isActiveCategory ? 'bg-eggplant-700 text-neutral-200 ' : ''
          } w-full text-sm px-2 py-1 hover:bg-eggplant-600 cursor-pointer transition`

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
  containerRef: PropTypes.any,
}

export default OptionsMenu
