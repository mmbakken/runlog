import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import CalendarDate from './CalendarDate'

const TrainingCalendar = ({ training }) => {
  training.weeks.sort((weekA, weekB) => {
    return (
      DateTime.fromISO(weekA.startDateISO) -
      DateTime.fromISO(weekB.startDateISO)
    )
  })

  training.dates.sort((dateA, dateB) => {
    return DateTime.fromISO(dateA.dateISO) - DateTime.fromISO(dateB.dateISO)
  })

  let rowClasses =
    'w-full flex grow-0 shrink-0 justify-center border-b border-l border-r border-gray-900'

  let columnAClasses = 'w-16 text-center px-2 py-1 border-r border-gray-900'
  let columnBClasses = 'w-40 text-center border-r border-gray-900'
  let columnCClasses = 'w-40 text-center border-r border-gray-900'
  let columnDClasses = 'w-40 text-center border-r border-gray-900'
  let columnEClasses = 'w-40 text-center border-r border-gray-900'
  let columnFClasses = 'w-40 text-center border-r border-gray-900'
  let columnGClasses = 'w-40 text-center border-r border-gray-900'
  let columnHClasses = 'w-40 text-center border-r border-gray-900'
  let columnIClasses = 'w-16 text-center px-2 py-1 border-r border-gray-900'
  let columnJClasses = 'w-16 text-center px-2 py-1'

  return (
    <div className='w-full'>
      {training.weeks.map((week, index) => {
        let rows = []
        if (index === 0) {
          rows.push(
            <div key='header' className={rowClasses + ' border-t'}>
              <div className={columnAClasses}>Week</div>
              <div className={columnBClasses + ' px-2 py-1'}>Monday</div>
              <div className={columnCClasses + ' px-2 py-1'}>Tuesday</div>
              <div className={columnDClasses + ' px-2 py-1'}>Wednesday</div>
              <div className={columnEClasses + ' px-2 py-1'}>Thursday</div>
              <div className={columnFClasses + ' px-2 py-1'}>Friday</div>
              <div className={columnGClasses + ' px-2 py-1'}>Saturday</div>
              <div className={columnHClasses + ' px-2 py-1'}>Sunday</div>
              <div className={columnIClasses}>Total</div>
              <div className={columnJClasses}>Diff</div>
            </div>
          )
        }

        rows.push(
          <div key={index} className={rowClasses}>
            <div className={columnAClasses}>{index + 1}</div>
            <CalendarDate
              className={columnBClasses}
              date={training.dates[index * 7]}
            />
            <CalendarDate
              className={columnCClasses}
              date={training.dates[index * 7 + 1]}
            />
            <CalendarDate
              className={columnDClasses}
              date={training.dates[index * 7 + 2]}
            />
            <CalendarDate
              className={columnEClasses}
              date={training.dates[index * 7 + 3]}
            />
            <CalendarDate
              className={columnFClasses}
              date={training.dates[index * 7 + 4]}
            />
            <CalendarDate
              className={columnGClasses}
              date={training.dates[index * 7 + 5]}
            />
            <CalendarDate
              className={columnHClasses}
              date={training.dates[index * 7 + 6]}
            />
            <div className={columnIClasses}>{week.actualDistance}</div>
            <div className={columnJClasses}>{week.percentChange || '–'}</div>
          </div>
        )

        return rows
      })}
    </div>
  )
}

TrainingCalendar.propTypes = {
  training: PropTypes.shape({
    userId: PropTypes.string.isRequired, // Runlog: 'user._id'
    startDate: PropTypes.string.isRequired, // ISO 8601, like 2022-03-29
    endDate: PropTypes.string.isRequired, // ISO 8601, like 2022-03-29
    timezone: PropTypes.string.isRequired, // This is not just an offset
    title: PropTypes.string.isRequired, // User-defined name, required to create a new training plan
    goal: PropTypes.string.isRequired, // Allows the user to keep their aspirations in view while reviewing training plan
    isActive: PropTypes.bool.isRequired, // Is this plan the one the user is currently following?

    // Plan-wide distance totals
    actualDistance: PropTypes.number.isRequired, // Total of all runs that have actually happened in this plan period
    plannedDistance: PropTypes.number.isRequired, // Sum of all runs that have actually happened + planned runs in future dates for this plan

    // Week-specific distance totals
    weeks: PropTypes.array.isRequired,

    // These objects are the basis of the Calendar section. They allow the user to see daily distance
    // totals, workout descriptions, and
    dates: PropTypes.array.isRequired,

    // The journal is a section of the training plan where the user can add text comments about their
    // progress, specific workouts, injury status, etc.
    journal: PropTypes.array.isRequired,
  }),
}

export default TrainingCalendar