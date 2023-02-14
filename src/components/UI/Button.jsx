import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ type, onClick, children }) => {
  // Valid types:
  //   'primary' => a colorful button with white text. Main actions.
  //   'secondary' => a dark button with gray text. Less common actions.
  const classesByType = {
    primary:
      'px-4 py-2 text-neutral-200 border rounded border-neutral-300 bg-eggplant-700 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300',
    secondary:
      'text-sm px-4 py-2 text-neutral-200 border rounded border-neutral-500 bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300',
    inline:
      'text-xs px-2 py-1 text-neutral-200 border rounded border-neutral-500 bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300',
  }

  return (
    <button
      className={classesByType[type]}
      onClick={(e) => {
        onClick(e)
      }}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
}

export default Button
