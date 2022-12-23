import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import WorkoutTextInput from './WorkoutTextInput'
import PlannedDistanceInput from './PlannedDistanceInput'

import formatMileage from '../../../formatters/formatMileage.js'

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

  let optionMenu = useRef(null)
  let optionMenuClasses =
    'absolute left-28 lg:left-36 top-0 text-left border rounded border-gray-900 bg-offwhite-100 z-50'
  let maskClasses =
    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0 z-40'
  if (isOptionMenuVisible) {
    optionMenuClasses += ' block'
    maskClasses += ' block'
  } else {
    optionMenuClasses += ' hidden'
    maskClasses += ' hidden'
  }

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
    'w-18 px-3 py-1 flex items-center align-center border-r border-gray-900 select-none '

  // If date is selected, show selected UI
  let classes

  if (isSelectedDate) {
    classes =
      'relative grow-1 basis-40 shrink-0 text-center outline outline-3 outline-eggplant-700 transition-outline z-10 '
  } else {
    classes =
      'relative grow-1 basis-40 shrink-0 text-center border-b border-r border-gray-900 '
  }

  if (isSelectedWeek) {
    classes +=
      ' border-t-eggplant-700 border-b-3 border-t-2 border-b-eggplant-700 z-10 '
  }

  if (isLastRow) {
    classes += ' border-b '
  }

  if (disableSelection) {
    classes += categoryClassName[date.workoutCategory]
  } else {
    if (isHovering) {
      classes +=
        categoryClassNameHover[date.workoutCategory] + ' cursor-pointer'
    } else {
      classes += categoryClassName[date.workoutCategory] + ' cursor-pointer'
    }
  }

  useEffect(() => {
    if (disableSelection) {
      setIsHovering(false)
    }
  }, [disableSelection])

  useEffect(() => {
    // Allow user to hide the option menu with ESC key or a click outside of the menu
    const handleEscPress = (event) => {
      if (event.keyCode === 27) {
        setIsOptionMenuVisible(false)
      }
    }

    window.addEventListener('keydown', handleEscPress)

    // Unregister listeners on dismount
    return () => {
      window.removeEventListener('keydown', handleEscPress)
    }
  }, [])

  const onMenuClick = (e) => {
    e.preventDefault()
    setIsOptionMenuVisible(true)
    optionMenu.current.focus()
  }

  const onMaskClick = () => {
    setIsOptionMenuVisible(false)
  }

  return (
    <div
      className={classes}
      onContextMenu={(e) => {
        onMenuClick(e)
      }}
    >
      <div className='w-full flex items-center justify-between border-b border-gray-500'>
        <div
          className={dateBoxClasses}
          onClick={() => onDateClick(dt.toISODate())}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {dt.toFormat('MM/dd')}
        </div>
        <div className='w-16 px-3 py-1'>
          {showPlannedInput && (
            <PlannedDistanceInput
              distance={date.plannedDistance}
              onChange={(value) =>
                onDateEdit('plannedDistance', value, dt.toISODate())
              }
            />
          )}

          {!showPlannedInput && (
            <span className='block text-center font-semibold h-6 w-full cursor-default'>
              {formatMileage(date.actualDistance)}
            </span>
          )}
        </div>
      </div>

      <WorkoutTextInput
        text={date.workout}
        onChange={(value) => {
          onDateEdit('workout', value, dt.toISODate())
        }}
      />

      <div className={optionMenuClasses} ref={optionMenu}>
        <ul className='flex flex-col w-max'>
          {categoryNames.map((categoryName, index) => {
            const isActiveCategory = date.workoutCategory === index
            const optionClasses = `${
              isActiveCategory ? 'bg-eggplant-700 text-white ' : ''
            } px-3 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition`

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
        </ul>
      </div>

      <div
        className={maskClasses}
        onClick={() => {
          onMaskClick()
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