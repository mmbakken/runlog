import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import CalendarDate from './CalendarDate'

const TrainingCalendar = ({ training }) => {
  const dispatch = useContext(StateContext)[1]
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null)

  training.weeks.sort((weekA, weekB) => {
    return (
      DateTime.fromISO(weekA.startDateISO) -
      DateTime.fromISO(weekB.startDateISO)
    )
  })

  training.dates.sort((dateA, dateB) => {
    return DateTime.fromISO(dateA.dateISO) - DateTime.fromISO(dateB.dateISO)
  })

  let columnAClasses =
    'w-16 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 border-r border-gray-900'
  let columnIClasses =
    'w-16 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 border-r border-gray-900'
  let columnJClasses =
    'w-16 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1'

  const onDateEdit = (field, value, dateISO) => {
    dispatch({
      type: actions.UPDATE_TRAINING_PLAN_DATE__START,
    })

    APIv1.put(`/training/${training._id}/date/${dateISO}`, {
      updates: {
        [field]: value,
      },
    })
      .then((response) => {
        dispatch({
          type: actions.UPDATE_TRAINING_PLAN_DATE__SUCCESS,
          plan: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.UPDATE_TRAINING_PLAN_DATE__ERROR,
          error: error,
        })
      })
  }

  // Ignore unless in edit mode. Then, toggle the selection of this week
  const onWeekClick = (weekIndex) => {
    if (selectedWeekIndex === weekIndex) {
      setSelectedWeekIndex(null)
    } else {
      setSelectedWeekIndex(weekIndex)
    }
  }

  return (
    <div className='w-full text-sm lg:text-base z-0'>
      {training.weeks.map((week, index) => {
        let rows = []
        if (index === 0) {
          rows.push(
            <div
              key='header'
              className='lg:w-full w-248 flex bg-offwhite-100 border-gray-900 border-t border-l border-r'
            >
              <div className={columnAClasses}>Week</div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Monday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Tuesday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Wednesday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Thursday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Friday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Saturday
              </div>
              <div
                className={
                  'basis-48 grow-1 shrink-1 text-center border-r border-gray-900 px-2 py-1'
                }
              >
                Sunday
              </div>
              <div className={columnIClasses}>Total</div>
              <div className={columnJClasses}>Diff</div>
            </div>
          )
        }

        let weekRowClasses =
          'relative lg:w-full w-248 flex bg-offwhite-100 border-r border-l transition-outline-width'
        let weekCellClasses =
          'cursor-pointer hover:bg-eggplant-700 hover:text-white hover:border-eggplant-700 transition'
        let selectedWeekCellClasses =
          'cursor-pointer bg-eggplant-700 border-eggplant-700 text-white hover:bg-eggplant-600 transition'

        let isSelectedWeek = selectedWeekIndex === index

        if (index === 0) {
          weekRowClasses += ' border-t'
        }

        if (selectedWeekIndex === index) {
          weekRowClasses +=
            ' border-eggplant-700 border-t border-b outline outline-eggplant-700 z-10'
        } else if (selectedWeekIndex - 1 === index) {
          weekRowClasses += ' border-gray-900' // This is the row below the selected one
        } else {
          weekRowClasses += ' border-gray-900 border-b' // This is the row above the selected one
        }

        rows.push(
          <div key={index} className={weekRowClasses}>
            <div
              className={
                isSelectedWeek
                  ? `${columnAClasses} ${selectedWeekCellClasses}`
                  : `${columnAClasses} ${weekCellClasses}`
              }
              onClick={() => onWeekClick(index)}
            >
              {index + 1}
            </div>
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 1]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 2]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 3]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 4]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 5]}
              onDateEdit={onDateEdit}
            />
            <CalendarDate
              className={
                'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }
              date={training.dates[index * 7 + 6]}
              onDateEdit={onDateEdit}
            />
            <div className={columnIClasses}>{week.plannedDistance}</div>
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
    _id: PropTypes.string.isRequired,
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

    // Fields added and used by ViewTrainingPlan component when in edit mode. Do not display these.
    ui: PropTypes.object,
  }),
}

export default TrainingCalendar
