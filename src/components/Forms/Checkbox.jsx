import React from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

// Simple component for displaying table headers
const Checkbox = ({ className, checked, onChange }) => {
  let checkClasses = 'text-neutral-200'

  if (!checked) {
    checkClasses += ' opacity-0'
  }

  return (
    <div
      className={`${className} p-1 flex items-center justify-center text-xs cursor-pointer border rounded border-neutral-300 bg-neutral-800`}
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
