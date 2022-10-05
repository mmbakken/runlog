import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

// TODO: Workout category should determine cell color
//import workoutCategoryColorMap from './workoutCategoryColorMap.js'

const CalendarDate = ({
  date,
  className,
  onDistanceEdit,
  onWorkoutStrEdit,
}) => {
  const dt = DateTime.fromISO(date.dateISO, { zone: 'utc' })

  // TODO: Display actual distance if any is present. Display plannedDistance otherwise.

  return (
    <div className={className + ' bg-green-200'}>
      <div className='w-full flex'>
        <div className='w-1/2 mx-auto py-1 flex items-center justify-center border-b border-r border-gray-900'>
          {dt.toFormat('MM/dd')}
        </div>
        <div className='w-1/2 mx-auto py-1 border-b border-gray-300'>
          <input
            type='number'
            min='0'
            step='1'
            className='text-center resize-none h-full w-full bg-transparent outline-none p-1'
            value={date.plannedDistance}
            onChange={(event) => {
              onDistanceEdit(event.target.value, dt.toISODate())
            }}
          />
        </div>
      </div>
      <div className='w-full h-32'>
        <textarea
          className='text-xs lg:text-sm resize-none h-full w-full bg-transparent outline-none p-1'
          spellCheck={false}
          value={date.workout}
          onChange={(event) => {
            onWorkoutStrEdit(event.target.value, dt.toISODate())
          }}
        />
      </div>
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
  onDistanceEdit: PropTypes.func.isRequired,
  onWorkoutStrEdit: PropTypes.func.isRequired,
  // onWorkoutCategoryEdit: PropTypes.func.isRequired, // TODO: Design UX for changing category
}

export default CalendarDate
