import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import DropdownOption from './DropdownOption'

const DEFAULT_PLACEHOLDER = 'Select an option...'

const Dropdown = ({ options, selectedId, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

  let selectedOption = options.find((option) => {
    return option._id === selectedId
  })

  const placeholderText =
    placeholder == null || placeholder === ''
      ? DEFAULT_PLACEHOLDER
      : placeholder
  let selectorClasses =
    'w-full flex justify-between items-center border px-4 py-2 bg-neutral-800 cursor-pointer'
  let optionsClasses =
    'left-0 right-0 -mt-px absolute flex flex-col border rounded-b'

  selectorClasses += isOpen ? ' rounded-t' : ' rounded'

  const onSelectedOption = (id) => {
    setIsOpen(false)
    onSelect(id) // Callback
  }

  return (
    <div className='relative'>
      <div
        className={selectorClasses}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <span>
          {selectedId == null ? placeholderText : selectedOption?.title}
        </span>
        <FontAwesomeIcon className={'ml-2 inline-block'} icon={faChevronDown} />
      </div>

      {isOpen ? (
        <div className={optionsClasses}>
          {options.map((option) => {
            return (
              <DropdownOption
                key={option._id}
                id={option._id}
                title={option.title}
                isSelected={selectedId === option._id}
                onSelect={() => onSelectedOption(option._id)}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

Dropdown.propTypes = {
  options: PropTypes.array,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
}

export default Dropdown
