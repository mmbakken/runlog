import React from 'react'
import PropTypes from 'prop-types'
import PlannedDistanceInput from './PlannedDistanceInput'
import { formatActualMileage } from '../../../formatters/formatMileage.js'

const DateDistance = ({
  showPlannedInput,
  isoDate,
  onDateEdit,
  plannedDistance,
  actualDistance,
}) => {
  return (
    <div className='w-32 px-2 py-1 text-right cursor-default'>
      {showPlannedInput ? (
        <PlannedDistanceInput
          distance={plannedDistance}
          onChange={(value) => onDateEdit('plannedDistance', value, isoDate)}
        />
      ) : (
        <span className='h-6 cursor-default'>
          {formatActualMileage(actualDistance)}
        </span>
      )}
    </div>
  )
}

DateDistance.propTypes = {
  showPlannedInput: PropTypes.bool.isRequired,
  isoDate: PropTypes.string.isRequired,
  onDateEdit: PropTypes.func,
  plannedDistance: PropTypes.number,
  actualDistance: PropTypes.number,
}

export default DateDistance
