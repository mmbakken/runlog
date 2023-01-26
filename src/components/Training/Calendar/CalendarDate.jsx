import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import WorkoutTextInput from './WorkoutTextInput'
import PlannedDistanceInput from './PlannedDistanceInput'
import OptionsMenu from '../../UI/OptionsMenu'

import { formatActualMileage } from '../../../formatters/formatMileage.js'

const CalendarDate = ({
  date,
  isSelectedDate,
  isSelectedWeek,
  isLastRow,
  onDateEdit,
  onDateClick,
  disableSelection,
}) => {
  const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const dt = DateTime.fromISO(date.dateISO, { zone: 'utc' }).startOf('day')
  const now = DateTime.now().startOf('day')

  let isPastDate = dt < now
  const isCurrentDate = now.toISODate() === dt.toISODate()
  if (isCurrentDate) {
    isPastDate = false
  }

  let showPlannedInput = true

  if (isPastDate || (date.actualDistance > 0 && isCurrentDate)) {
    showPlannedInput = false
  }

  // This list has to be in this file in order for Tailwind to generate the class names correctly
  const categoryClassName = {
    0: 'bg-rest-600',
    1: 'bg-long-600',
    2: 'bg-easy-600',
    3: 'bg-tempo-600',
    4: 'bg-intervals-600',
    5: 'bg-repetitions-600',
    6: 'bg-marathon-600',
    7: 'bg-race-600',
    8: 'bg-trail-run-600',
    9: 'bg-hiking-600',
    10: 'bg-spinning-600',
    11: 'bg-downhill-skiing-600',
    12: 'bg-backcountry-skiing-600',
    13: 'bg-lifting-600',
  }

  const categoryClassNameHover = {
    0: 'bg-rest-700',
    1: 'bg-long-700',
    2: 'bg-easy-700',
    3: 'bg-tempo-700',
    4: 'bg-intervals-700',
    5: 'bg-repetitions-700',
    6: 'bg-marathon-700',
    7: 'bg-race-700',
    8: 'bg-trail-run-700',
    9: 'bg-hiking-700',
    10: 'bg-spinning-700',
    11: 'bg-downhill-skiing-700',
    12: 'bg-backcountry-skiing-700',
    13: 'bg-lifting-700',
  }

  const categoryNames = [
    'Rest',
    'Long',
    'Easy',
    'Tempo',
    'Intervals',
    'Repetitions',
    'Marathon',
    'Race',
    'Trail Run',
    'Hiking',
    'Spinning',
    'Downhill Skiing',
    'Backcountry Skiing',
    'Lifting',
  ]

  let dateBoxClasses =
    'w-18 px-2 py-1 flex items-center align-center border-r border-gray-900 select-none'

  let categoryButtonClasses =
    'w-full flex align-center items-center justify-between text-center py-1 border-b border-gray-900 border-opacity-30 text-sm text-gray-700 px-2'

  // If date is selected, show selected UI
  let classes

  if (isSelectedDate) {
    classes =
      'basis-56 grow-1 shrink-1 text-center outline outline-3 outline-eggplant-700 transition-outline z-10 '
  } else {
    classes =
      'basis-56 grow-1 shrink-1 text-center border-b border-r border-gray-900 '
  }

  if (isSelectedWeek) {
    classes +=
      ' border-t-eggplant-700 border-b-3 border-t-2 border-b-eggplant-700 '
  }

  if (isLastRow) {
    classes += ' border-b '
  }

  if (disableSelection) {
    classes += categoryClassName[date.workoutCategory]
    categoryButtonClasses += ' cursor-default'
  } else {
    categoryButtonClasses += ' cursor-pointer'

    if (isHovering) {
      classes += categoryClassNameHover[date.workoutCategory]
      dateBoxClasses += ' cursor-pointer'
    } else {
      classes += categoryClassName[date.workoutCategory]
    }
  }

  useEffect(() => {
    if (disableSelection) {
      setIsHovering(false)
    }
  }, [disableSelection])

  const onMenuClick = (e) => {
    if (!disableSelection) {
      e.preventDefault()
      setIsOptionMenuVisible(true)
    }
  }

  return (
    <div className={classes}>
      <div className='w-full flex justify-between border-b border-gray-900 border-opacity-60'>
        <div
          className={dateBoxClasses}
          onClick={() => onDateClick(dt.toISODate())}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {dt.toLocaleString({
            month: 'numeric',
            day: 'numeric',
          })}
        </div>

        <div className='px-2 py-1 text-right cursor-default'>
          {showPlannedInput ? (
            <PlannedDistanceInput
              distance={date.plannedDistance}
              onChange={(value) =>
                onDateEdit('plannedDistance', value, dt.toISODate())
              }
            />
          ) : (
            <span className='h-6 cursor-default'>
              {formatActualMileage(date.actualDistance)}
            </span>
          )}
        </div>
      </div>

      <div className='w-full relative'>
        <button
          className={categoryButtonClasses}
          onClick={(e) => {
            onMenuClick(e)
          }}
        >
          <span>{categoryNames[date.workoutCategory]}</span>
          <span className='text-xs cursor-pointer'>
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </button>

        <OptionsMenu
          isVisible={isOptionMenuVisible}
          hide={() => {
            setIsOptionMenuVisible(false)
          }}
        >
          {categoryNames.map((categoryName, index) => {
            const isActiveCategory = date.workoutCategory === index
            const optionClasses = `${
              isActiveCategory ? 'bg-eggplant-700 text-white ' : ''
            } w-full text-sm px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition`

            return (
              <li
                key={index}
                tabIndex='0'
                className={optionClasses}
                onClick={() => {
                  setIsOptionMenuVisible(false)
                  onDateEdit('workoutCategory', index, dt.toISODate())
                }}
              >
                {categoryName}
              </li>
            )
          })}
        </OptionsMenu>
      </div>

      <WorkoutTextInput
        text={date.workout}
        onChange={(value) => {
          onDateEdit('workout', value, dt.toISODate())
        }}
      />
    </div>
  )
}

CalendarDate.propTypes = {
  isSelectedDate: PropTypes.bool.isRequired,
  isSelectedWeek: PropTypes.bool.isRequired,
  isLastRow: PropTypes.bool.isRequired,
  date: PropTypes.shape({
    dateISO: PropTypes.string.isRequired, // ISO 8601, like 2022-03-29
    actualDistance: PropTypes.number, // will often be null
    plannedDistance: PropTypes.number, // sometimes null, usually a number though
    workout: PropTypes.string,
    workoutCategory: PropTypes.number,
  }).isRequired,
  onDateEdit: PropTypes.func.isRequired,
  onDateClick: PropTypes.func.isRequired,
  disableSelection: PropTypes.bool.isRequired,
}

export default CalendarDate
