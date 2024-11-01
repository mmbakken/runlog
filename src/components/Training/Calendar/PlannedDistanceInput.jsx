import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Returns the UI value to use for date.plannedDistance, or 0 if there is none.
const getPlannedDistanceUIValue = (distance) => {
  if (distance != null && distance != '' && typeof distance === 'number') {
    return distance
  }

  return 0
}

// Helper function to limit decimal places and format desired distance appropriately
const getCleanDistance = (value) => {
  let cleanDistance = 0

  if (value != null && value.length > 0) {
    let integerStr = value.toString().split('.')[0]
    let integer = Math.abs(parseInt(integerStr))
    let decimalStr = value.toString().split('.')[1]
    let decimal = parseInt(decimalStr)

    cleanDistance = integer

    if (!isNaN(decimal)) {
      cleanDistance += parseFloat(`0.${decimalStr.substring(0, 2)}`)
    }
  }

  return cleanDistance
}

const PlannedDistanceInput = ({ distance, onChange }) => {
  const DEBOUNCE_TIME_IN_MS = 1000

  const [plannedDistanceUI, setPlannedDistanceUI] = useState(0)
  const [distanceTimeoutRef, setDistanceTimeoutRef] = useState(null)

  useEffect(() => {
    if (distanceTimeoutRef == null) {
      setPlannedDistanceUI(getPlannedDistanceUIValue(distance))
    }
  }, [distance])

  const onDistanceChange = (value) => {
    const cleanDistance = getCleanDistance(value)

    // Update UI state right away
    setPlannedDistanceUI(cleanDistance)

    // Cancel any previously scheduled API call
    clearTimeout(distanceTimeoutRef)

    // In X ms, save this text to the API (unless we cancel it first and send another update)
    setDistanceTimeoutRef(
      setTimeout(() => {
        onChange(cleanDistance)
      }, DEBOUNCE_TIME_IN_MS)
    )
  }

  return (
    <input
      type='number'
      min='0'
      step='1'
      className='h-6 w-full cursor-default resize-none bg-transparent text-right outline-none'
      value={plannedDistanceUI.toString()}
      onFocus={(e) => {
        e.target.select()
      }}
      onChange={(event) => {
        onDistanceChange(event.target.value)
      }}
      onContextMenu={(event) => event.preventDefault()}
    />
  )
}

PlannedDistanceInput.propTypes = {
  distance: PropTypes.number, // sometimes null, usually a number though
  onChange: PropTypes.func.isRequired,
}

export default PlannedDistanceInput
