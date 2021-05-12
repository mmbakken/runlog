import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Simple component for displaying table headers
const RunResultsCell = ({ results, showDialog }) => {
  const [showPrompt, setShowPrompt] = useState()

  const handleMouseEnter = (e) => {
    e.preventDefault()
    console.log('enter')
    setShowPrompt(true)
  }

  return (
    <div
      className='w-24 h-12 cursor-pointer'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setShowPrompt(false)
      }}
      onClick={showDialog}
    >
      {results && (
        <span className='overflow-ellipsis overflow-hidden'>{results}</span>
      )}

      {!results && (
        <span className=''>
          {showPrompt && <span>How&#39;d it go today?</span>}
        </span>
      )}
    </div>
  )
}

RunResultsCell.propTypes = {
  results: PropTypes.string,
  showDialog: PropTypes.func.isRequired,
}

export default RunResultsCell
