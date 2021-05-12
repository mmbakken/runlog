import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

// Simple component for displaying table headers
const Checkbox = ({ checked, onChange }) => {
  let checkClasses = 'text-gray-900'

  if (!checked) {
    checkClasses += ' opacity-0'
  }

  return (
    <div
      className='w-4 h-4 p-1 flex items-center justify-center text-xs cursor-pointer border rounded border-solid border-gray-900'
      onClick={onChange}
    >
      <FontAwesomeIcon className={checkClasses} icon={faCheck} />
    </div>
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox
