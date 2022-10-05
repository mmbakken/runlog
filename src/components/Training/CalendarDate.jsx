import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

const CalendarDate = ({ date, className, onDateEdit }) => {
  const dt = DateTime.fromISO(date.dateISO, { zone: 'utc' })

  // This list has to be in this file in order for Tailwind to generate the class names correctly
  const categoryClassName = {
    0: 'bg-rest',
    1: 'bg-long',
    2: 'bg-easy',
    3: 'bg-tempo',
    4: 'bg-intervals',
    5: 'bg-repetitions',
    6: 'bg-marathon',
    7: 'bg-race',
    8: 'bg-trail-run',
    9: 'bg-hiking',
    10: 'bg-spinning',
    11: 'bg-downhill-skiing',
    12: 'bg-backcountry-skiing',
    13: 'bg-lifting',
  }
  const classes = className + ' ' + categoryClassName[date.workoutCategory]

  return (
    <div className={classes}>
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
              onDateEdit('plannedDistance', event.target.value, dt.toISODate())
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
            onDateEdit('workout', event.target.value, dt.toISODate())
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
  onDateEdit: PropTypes.func.isRequired,
}

export default CalendarDate
