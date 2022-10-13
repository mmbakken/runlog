import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import CalendarDate from './CalendarDate'

const TrainingCalendar = ({ training, disableSelection }) => {
  const dispatch = useContext(StateContext)[1]
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null)
  const [hoveringWeekIndex, setHoveringWeekIndex] = useState(null)
  const [selectedDateISO, setSelectedDateISO] = useState(null)

  training.weeks.sort((weekA, weekB) => {
    return (
      DateTime.fromISO(weekA.startDateISO) -
      DateTime.fromISO(weekB.startDateISO)
    )
  })

  training.dates.sort((dateA, dateB) => {
    return DateTime.fromISO(dateA.dateISO) - DateTime.fromISO(dateB.dateISO)
  })

  let columnWeekClasses =
    'w-16 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 border-r border-gray-900'
  let columnTotalClasses =
    'w-16 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 border-r border-gray-900'
  let columnDiffClasses =
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

  useEffect(() => {
    if (disableSelection) {
      setSelectedWeekIndex(null)
      setSelectedDateISO(null)
      setHoveringWeekIndex(null)
    }
  }, [disableSelection])

  const onWeekClick = (weekIndex) => {
    setSelectedDateISO(null)

    if (disableSelection) {
      return setSelectedWeekIndex(null)
    }

    if (selectedWeekIndex === weekIndex) {
      setSelectedWeekIndex(null)
    } else {
      setSelectedWeekIndex(weekIndex)
    }
  }

  const onDateClick = (dateISO) => {
    setSelectedWeekIndex(null)

    if (disableSelection) {
      return setSelectedDateISO(null)
    }

    if (selectedDateISO == dateISO) {
      setSelectedDateISO(null)
    } else {
      setSelectedDateISO(dateISO)
    }
  }

  return (
    <div className='w-full text-sm lg:text-base z-0'>
      {training.weeks.map((week, weekIndex) => {
        let rows = []
        if (weekIndex === 0) {
          rows.push(
            <div
              key='header'
              className='lg:w-full w-248 flex bg-offwhite-100 border-gray-900 border-t border-l border-r'
            >
              <div className={columnWeekClasses}>Week</div>
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
              <div className={columnTotalClasses}>Total</div>
              <div className={columnDiffClasses}>Diff</div>
            </div>
          )
        }

        // Week selection UI
        let weekRowClasses =
          'relative lg:w-full w-248 flex bg-offwhite-100 border-r border-l transition-outline'

        const isSelectedWeek = selectedWeekIndex === weekIndex
        const isHoveringWeek = hoveringWeekIndex === weekIndex

        if (weekIndex === 0) {
          weekRowClasses += ' border-t'
        }

        let weekCellClasses = columnWeekClasses + ' transition'

        if (!disableSelection) {
          if (isSelectedWeek) {
            weekCellClasses +=
              ' cursor-pointer bg-eggplant-700 border-eggplant-700 text-white'

            if (isHoveringWeek) {
              weekCellClasses += ' bg-eggplant-600'
            }
          } else {
            weekCellClasses += ' cursor-pointer'

            if (isHoveringWeek) {
              weekCellClasses +=
                ' bg-eggplant-700 border-eggplant-700 text-white'
            }
          }
        }

        if (isSelectedWeek) {
          weekRowClasses +=
            ' border-eggplant-700 border-t border-b outline outline-eggplant-700 z-10'
        } else if (selectedWeekIndex - 1 === weekIndex) {
          weekRowClasses += ' border-gray-900' // This is the row below the selected one
        } else {
          weekRowClasses += ' border-gray-900 border-b' // This is the row above the selected one
        }

        // Date selection UI
        const dateIndexes = [0, 1, 2, 3, 4, 5, 6]

        rows.push(
          <div key={weekIndex} className={weekRowClasses}>
            <div
              className={weekCellClasses}
              onClick={() => onWeekClick(weekIndex)}
              onMouseEnter={() => setHoveringWeekIndex(weekIndex)}
              onMouseLeave={() => setHoveringWeekIndex(null)}
            >
              {weekIndex + 1}
            </div>

            {dateIndexes.map((dateIndex) => {
              const date = training.dates[weekIndex * 7 + dateIndex]

              // If date is selected, show selected UI
              let dateCellClasses

              if (date.dateISO.split('T')[0] === selectedDateISO) {
                dateCellClasses =
                  'relative grow-1 basis-48 grow-1 shrink-1 text-center outline outline-3 outline-eggplant-700 transition-outline z-10'
              } else {
                dateCellClasses =
                  'relative grow-1 basis-48 grow-1 shrink-1 text-center border-r border-gray-900'
              }

              return (
                <CalendarDate
                  key={dateIndex}
                  className={dateCellClasses}
                  date={date}
                  onDateEdit={onDateEdit}
                  onDateClick={onDateClick}
                  disableSelection={disableSelection}
                />
              )
            })}

            <div className={columnTotalClasses}>{week.plannedDistance}</div>
            <div className={columnDiffClasses}>{week.percentChange || '–'}</div>
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

  disableSelection: PropTypes.bool.isRequired, // Flag to deselect all weeks and dates and disallow selection
}

export default TrainingCalendar
