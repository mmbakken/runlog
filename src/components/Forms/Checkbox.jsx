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
      className={`${className} flex cursor-pointer items-center justify-center rounded border border-neutral-300 bg-neutral-800 p-1 text-xs`}
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
