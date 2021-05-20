import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

// Simple component for displaying table headers
const Checkbox = ({ className, checked, onChange }) => {
  let checkClasses = 'text-xl text-gray-600'

  if (!checked) {
    checkClasses += ' opacity-0'
  }

  return (
    <div
      className={`${className} p-2 flex items-center justify-center text-xs cursor-pointer border rounded border-solid border-gray-600 bg-offwhite-25`}
      onClick={onChange}
    >
      <FontAwesomeIcon className={checkClasses} icon={faCheck} />
    </div>
  )
}

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox
