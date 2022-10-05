import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

const CalendarDate = ({ date, className }) => {
  const dt = DateTime.fromISO(date.dateISO, { zone: 'utc' })

  // TODO: Workout category should color the whole cell. What mapping to use?

  // TODO: Display actual distance if any is present. Display plannedDistance otherwise.

  return (
    <div className={className + ' bg-green-200'}>
      <div className='w-full flex'>
        <div className='w-1/2 mx-auto py-1 border-b border-r border-gray-900'>
          {dt.toFormat('MM/dd')}
        </div>
        <div className='w-1/2 mx-auto py-1 border-b border-gray-300'>
          {dt.actualDistance || dt.plannedDistance || 0}
        </div>
      </div>
      <div className='w-full h-32'>{date.workout || ''}</div>
    </div>
  )
}

CalendarDate.propTypes = {
  className: PropTypes.string,
  date: PropTypes.shape({
    dateISO: PropTypes.string.isRequired, // ISO 8601, like 2022-03-29
    actualDistance: PropTypes.number, // will often be null
    plannedDistance: PropTypes.number, // sometimes null, usually a number though
    workout: PropTypes.string,
    workoutCategory: PropTypes.number,
  }).isRequired,
}

export default CalendarDate
