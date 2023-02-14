import React from 'react'
import PropTypes from 'prop-types'

const DropdownOption = ({ id, title, isSelected, onSelect }) => {
  let classes = 'px-4 py-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700'

  if (isSelected) {
    classes += ' font-semibold'
  }

  return (
    <div key={id} onClick={onSelect} className={classes}>
      {title}
    </div>
  )
}

DropdownOption.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
}

export default DropdownOption
