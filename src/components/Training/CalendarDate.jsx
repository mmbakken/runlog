import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

const CalendarDate = ({ date, className, onDateEdit }) => {
  const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)
  let optionMenu = useRef(null)
  let optionMenuClasses =
    'absolute left-28 lg:left-36 top-0 text-left border rounded border-gray-900 bg-offwhite-100 z-30'
  let maskClasses =
    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0 z-20'
  if (isOptionMenuVisible) {
    optionMenuClasses += ' block'
    maskClasses += ' block'
  } else {
    optionMenuClasses += ' hidden'
    maskClasses += ' hidden'
  }

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

  // Ignore unless in edit mode. In edit mode, this toggles date selection. Date selection is exclusive.
  const onDateClick = () => {
    console.log('TODO onDateClick')
  }

  return (
    <div
      className={`${className} ${
        categoryClassName[date.workoutCategory]
      } relative`}
      onContextMenu={(e) => {
        onMenuClick(e)
      }}
      onClick={() => onDateClick()}
    >
      <div className='w-full flex'>
        <div className='w-1/2 mx-auto py-1 flex items-center justify-center border-b border-r border-gray-900'>
          {dt.toFormat('MM/dd')}
        </div>
        <div className='w-1/2 mx-auto py-1 border-b border-gray-500'>
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
          className='text-xs lg:text-sm resize-none h-full w-full bg-transparent outline-none px-2 lg:px-3 py-1'
          spellCheck={false}
          value={date.workout}
          onChange={(event) => {
            onDateEdit('workout', event.target.value, dt.toISODate())
          }}
        />
      </div>

      <div className={optionMenuClasses} ref={optionMenu}>
        <ul className='flex flex-col w-max'>
          {categoryNames.map((categoryName, index) => {
            const isActiveCategory = date.workoutCategory === index
            const optionClasses = `${
              isActiveCategory ? 'bg-eggplant-700 text-white ' : ''
            } px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition`

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
