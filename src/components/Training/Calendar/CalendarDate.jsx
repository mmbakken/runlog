import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

import WorkoutTextInput from './WorkoutTextInput'
import PlannedDistanceInput from './PlannedDistanceInput'
import CategoryOptionsMenu from './CategoryOptionsMenu'

import { formatActualMileage } from '../../../formatters/formatMileage.js'

const CalendarDate = ({
  date,
  isSelectedDate,
  isSelectedWeek,
  isLastRow,
  onDateEdit,
  onDateClick,
  disableSelection,
  setIsFocusing,
  onMenuOpen,
}) => {
  const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef(null)

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
    0: 'bg-rest-800',
    1: 'bg-recovery-700',
    2: 'bg-easy-700',
    3: 'bg-long-700',
    4: 'bg-marathon-700',
    5: 'bg-tempo-700',
    6: 'bg-vo2max-700',
    7: 'bg-race-700',
    8: 'bg-cross-training-700',
  }

  const categoryClassNameHover = {
    0: 'bg-rest-700',
    1: 'bg-recovery-600',
    2: 'bg-easy-600',
    3: 'bg-long-600',
    4: 'bg-marathon-600',
    5: 'bg-tempo-600',
    6: 'bg-vo2max-600',
    7: 'bg-race-600',
    8: 'bg-cross-training-600',
  }

  const categoryNames = [
    'Rest',
    'Recovery',
    'Easy',
    'Long',
    'Marathon',
    'Tempo',
    'VO₂max',
    'Race',
    'Cross Training',
  ]

  let classes = 'basis-56 grow-1 shrink-1 text-center opacity-90'

  let dateBoxClasses =
    'w-18 px-2 py-1 flex items-center align-center border-r border-neutral-400 select-none'

  let categoryButtonClasses =
    'w-full flex align-center items-center justify-between text-center py-1 border-b border-neutral-400 border-opacity-30 text-sm px-2 focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-eggplant-700'

  if (isSelectedDate) {
    classes +=
      ' outline outline-3 border-r border-transparent drop-shadow outline-eggplant-700 transition-outline z-10 '
  } else {
    classes += ' border-b border-r border-neutral-400 '
  }

  if (isSelectedWeek) {
    classes += ' border-t-eggplant-700 border-b-transparent '
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
      setIsFocusing()
      e.preventDefault()
      setIsOptionMenuVisible(!isOptionMenuVisible)
    }
  }

  return (
    <div className={classes}>
      <div className='w-full flex justify-between border-b border-neutral-400 border-opacity-60'>
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

      <div className='w-full relative' ref={containerRef}>
        <button
          className={categoryButtonClasses}
          onClick={(e) => {
            onMenuClick(e)
            onMenuOpen()
          }}
        >
          <span>{categoryNames[date.workoutCategory]}</span>
          <span className='text-xs cursor-pointer'>
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </button>

        <CategoryOptionsMenu
          isVisible={isOptionMenuVisible}
          options={categoryNames}
          activeOption={date.workoutCategory}
          containerRef={containerRef}
          hide={() => {
            setIsOptionMenuVisible(false)
          }}
          onSelect={(index) => {
            setIsOptionMenuVisible(false)
            onDateEdit('workoutCategory', index, dt.toISODate())
          }}
        />
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
  setIsFocusing: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  disableSelection: PropTypes.bool.isRequired,
}

export default CalendarDate
