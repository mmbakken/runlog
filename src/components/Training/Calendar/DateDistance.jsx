import React from 'react'
import PropTypes from 'prop-types'
import PlannedDistanceInput from './PlannedDistanceInput'
import ActualDistance from './ActualDistance'

const DateDistance = ({
  showPlannedInput,
  isoDate,
  onDateEdit,
  plannedDistance,
  actualDistance,
  runIds,
}) => {
  return (
    <div className='w-32 cursor-default px-2 py-1 text-right'>
      {showPlannedInput ? (
        <PlannedDistanceInput
          distance={plannedDistance}
          onChange={(value) => onDateEdit('plannedDistance', value, isoDate)}
        />
      ) : (
        <ActualDistance
          distance={actualDistance}
          runIds={runIds}
          isoDate={isoDate}
        />
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
  runIds: PropTypes.array,
}

export default DateDistance
