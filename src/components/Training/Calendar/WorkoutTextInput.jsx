import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const WorkoutTextInput = ({ text, onChange }) => {
  const DEBOUNCE_TIME_IN_MS = 1000

  // Debouncing input requires a UI-specific value
  const [workoutText, setWorkoutText] = useState('')
  const [workoutTimeoutRef, setWorkoutTimeoutRef] = useState(null)

  useEffect(() => {
    if (workoutTimeoutRef == null) {
      setWorkoutText(text == null ? '' : text)
    }
  }, [text])

  const onWorkoutChange = (value) => {
    // Update UI state right away
    setWorkoutText(value)

    // Cancel any previously scheduled API call
    clearTimeout(workoutTimeoutRef)

    // In X ms, save this text to the API (unless we cancel it first and send another update)
    setWorkoutTimeoutRef(
      setTimeout(() => {
        onChange(value)
      }, DEBOUNCE_TIME_IN_MS)
    )
  }

  return (
    <div className='w-full h-32'>
      <textarea
        className='text-xs lg:text-sm resize-none h-full w-full bg-transparent outline-none px-2 lg:px-3 py-1 cursor-default'
        spellCheck={false}
        value={workoutText}
        onChange={(event) => {
          onWorkoutChange(event.target.value)
        }}
      />
    </div>
  )
}

WorkoutTextInput.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default WorkoutTextInput
