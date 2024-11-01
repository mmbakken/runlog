import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import { StateContext } from '../../../context/StateContext'
import actions from '../../../reducers/actions'
import { APIv1 } from '../../../api'

import CalendarHeaderRow from './CalendarHeaderRow'
import CalendarWeekRow from './CalendarWeekRow'

import { formatActualMileage } from '../../../formatters/formatMileage.js'
import formatPercentDiff from '../../../formatters/formatPercentDiff.js'
import addFloats from '../../../utils/addFloats.js'

const TrainingCalendar = ({ training, disableSelection, updatePlan }) => {
  const dispatch = useContext(StateContext)[1]
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null)
  const [hoveringWeekIndex, setHoveringWeekIndex] = useState(null)
  const [selectedDateISO, setSelectedDateISO] = useState(null)
  const [focusWeekIndex, setFocusWeekIndex] = useState(null)
  const [allowCopy, setAllowCopy] = useState(false)
  const [allowPaste, setAllowPaste] = useState(false)
  const [copiedDate, setCopiedDate] = useState(null)
  const [copiedWeek, setCopiedWeek] = useState({
    exists: false,
    week: null, // Week object, copied from current training object
    dates: null, // Array of date objects, copied by value from current training plan value
  })

  training.weeks.sort((weekA, weekB) => {
    return (
      DateTime.fromISO(weekA.startDateISO) -
      DateTime.fromISO(weekB.startDateISO)
    )
  })

  // Calculate the display value for this week's mileage. It's a combination of its dates' planned
  // and actual distance values.
  let weekDisplayDistances = []
  let weekPercentDiff = ['–'] // null/NaN/Div-by-0 symbol
  const nowLocalDT = DateTime.now()

  // Today's local date, expressed as the same yyyy-mm-dd but in UTC at start of day. This is needed
  // to properly compare abstract dates in the calendar with the user's understanding of the current
  // ISO Date. Basically, it allows the user to edit planned mileage for current or future dates
  // that are close to the week boundaries within the timezone offset range.
  const startOfTodayUTC = nowLocalDT
    .startOf('day')
    .setZone('utc')
    .startOf('day')
  const todayISODate = startOfTodayUTC.toISODate()

  for (let weekIndex = 0; weekIndex < training.weeks.length; weekIndex++) {
    const week = training.weeks[weekIndex]
    const weekStartDT = DateTime.fromISO(week.startDateISO, { zone: 'utc' })
    const weekEndDT = weekStartDT.plus({ days: 7 })

    const weekISODates = [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
      return weekStartDT.plus({ days: dayOffset }).toISODate()
    })

    let weekDistance = 0

    // If this is the current week, we need to investigate its dates for their distances
    if (weekISODates.indexOf(todayISODate) >= 0) {
      // For each date in this week, sum the actualDistances.
      // If no actualDistance, use plannedDistanceMeters. If no plannedDistanceMeters, use 0.
      for (let date of training.dates) {
        const dateDT = DateTime.fromISO(date.dateISO, { zone: 'utc' }).startOf(
          'day'
        )

        if (weekStartDT <= dateDT && dateDT < weekEndDT) {
          let dateDistance = date.actualDistance

          if (startOfTodayUTC <= dateDT) {
            dateDistance = dateDistance || date.plannedDistanceMeters
          }

          weekDistance = addFloats(weekDistance, dateDistance)
        }
      }
    }

    // Otherwise, this is either a past week or a future week
    else if (weekStartDT < startOfTodayUTC) {
      weekDistance = week.actualDistance // Past week
    } else {
      weekDistance = week.plannedDistanceMeters // Future week
    }

    weekDisplayDistances[weekIndex] = weekDistance
  }

  // Based on the display distances, calculate the % difference per week
  // Always skip the first week - can't calculate % change without previous week
  for (
    let weekIndex = 1;
    weekIndex < weekDisplayDistances.length;
    weekIndex++
  ) {
    const weekDistance = weekDisplayDistances[weekIndex]
    const prevWeekDistance = weekDisplayDistances[weekIndex - 1]

    if (prevWeekDistance === 0) {
      weekPercentDiff[weekIndex] = weekPercentDiff[0] // Always the null/NaN/Div-by-0 symbol
    } else {
      weekPercentDiff[weekIndex] =
        Math.round(
          ((weekDistance - prevWeekDistance) / prevWeekDistance) * 100 * 100
        ) / 100
    }
  }

  training.dates.sort((dateA, dateB) => {
    return DateTime.fromISO(dateA.dateISO) - DateTime.fromISO(dateB.dateISO)
  })

  let copyBtnClasses =
    'border border-neutral-500 rounded-lg px-2 py-1 transition whitespace-nowrap'
  let pasteBtnClasses =
    'border border-neutral-500 rounded-lg px-2 py-1 transition whitespace-nowrap'

  if (!disableSelection) {
    if (allowCopy) {
      copyBtnClasses +=
        ' cursor-pointer bg-eggplant-700 text-neutral-200 border-eggplant-700 hover:bg-eggplant-600'
    } else {
      copyBtnClasses += ' cursor-not-allowed bg-neutral-800'
    }

    if (allowPaste) {
      pasteBtnClasses +=
        ' cursor-pointer bg-eggplant-700 text-neutral-200 border-eggplant-700 hover:bg-eggplant-600'
    } else {
      pasteBtnClasses += ' cursor-not-allowed bg-neutral-800'
    }
  }

  let copyText = 'Copy'
  let pasteText = 'Paste'

  if (selectedWeekIndex != null) {
    copyText += ' Week'
    pasteText += ' Week'
  }

  if (selectedDateISO != null) {
    copyText += ' Date'
    pasteText += ' Date'
  }

  const showCopyPasteBox =
    selectedWeekIndex !== null || selectedDateISO !== null

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

  const onWeekClick = (weekIndex) => {
    setSelectedDateISO(null)
    setFocusWeekIndex(weekIndex)

    if (disableSelection) {
      return setSelectedWeekIndex(null)
    }

    if (selectedWeekIndex === weekIndex) {
      setSelectedWeekIndex(null)
      setAllowCopy(false)
      setAllowPaste(false)
    } else {
      setSelectedWeekIndex(weekIndex)
      setAllowCopy(true)

      if (copiedWeek.exists) {
        setAllowPaste(true)
      } else {
        setAllowPaste(false)
      }
    }
  }

  const onDateClick = (dateISO) => {
    setSelectedWeekIndex(null)
    setFocusWeekIndex(null)

    if (disableSelection) {
      setSelectedDateISO(null)
      setAllowPaste(false)
      return
    }

    if (selectedDateISO === dateISO) {
      setSelectedDateISO(null)
      setAllowCopy(false)
      setAllowPaste(false)
    } else {
      setSelectedDateISO(dateISO)
      setAllowCopy(true)

      if (copiedDate == null) {
        setAllowPaste(false)
      } else {
        setAllowPaste(true)
      }
    }
  }

  const onCopyClick = () => {
    if (!allowCopy) {
      console.error('Attempted copy while allowCopy is false, aborting')
      return
    }

    if (selectedWeekIndex != null) {
      // What dates are in this week?
      const weekStartDT = DateTime.fromISO(
        training.weeks[selectedWeekIndex].startDateISO,
        { zone: 'utc' }
      )
      const weekEndDT = weekStartDT.plus({ days: 7 })
      let thisDT
      let weekDates = training.dates.filter((date) => {
        thisDT = DateTime.fromISO(date.dateISO, { zone: 'utc' })
        return weekStartDT <= thisDT && thisDT < weekEndDT
      })

      setCopiedWeek({
        exists: true,
        week: {
          ...training.weeks[selectedWeekIndex],
        },
        dates: [...weekDates],
      })

      // Only allow one copied item at a time, since they share buttons
      setCopiedDate(null)

      setAllowPaste(true)
    } else if (selectedDateISO != null) {
      const date = training.dates.find((dateObj) => {
        return dateObj.dateISO.split('T')[0] === selectedDateISO
      })

      if (date == null) {
        return console.error(
          `Unable to find date with ISO: "${selectedDateISO}"`
        )
      }

      setCopiedDate({
        ...date,
      })

      // Only allow one copied item at a time, since they share buttons
      setCopiedWeek({
        exists: false,
        week: null,
        dates: null,
      })

      setAllowPaste(true)
    }
  }

  const onPasteClick = () => {
    if (!allowPaste) {
      console.error('Cannot paste: Attempted paste while allowPaste is false')
      return
    }

    if (copiedDate != null) {
      if (selectedDateISO == null) {
        return console.error(
          'Cannot paste date: no date is selected to paste over'
        )
      }

      const selectedDate = training.dates.find((dateObj) => {
        return dateObj.dateISO.split('T')[0] === selectedDateISO
      })

      pasteDate(selectedDate, copiedDate, training.weeks, training.dates)
    } else if (copiedWeek?.exists) {
      // Make sure there is a week selected right now
      if (selectedWeekIndex == null) {
        return console.error(
          'Cannot paste week: no week is selected to paste over'
        )
      }

      const selectedWeek = training.weeks[selectedWeekIndex]

      pasteWeek(
        selectedWeek,
        copiedWeek.week,
        copiedWeek.dates,
        training.weeks,
        training.dates
      )
    } else {
      return console.error(
        'Cannot paste: No copied date or copied week exists to paste from'
      )
    }
  }

  // Updates the training plan by hitting the API with the changes from this copied date
  const pasteDate = (selectedDate, copiedDate, currentWeeks, currentDates) => {
    if (selectedDate == null) {
      return console.error('Cannot paste date: selectedDate is required')
    }

    if (copiedDate == null) {
      return console.error('Cannot paste date: copiedDate is required')
    }

    if (currentWeeks == null) {
      return console.error('Cannot paste date: currentWeeks is required')
    }

    if (currentDates == null) {
      return console.error('Cannot paste date: currentDates is required')
    }

    // Replace the selectedDate with the copiedDate in the return dates array
    let updatedDates = []

    for (let currentDate of currentDates) {
      if (currentDate.dateISO === selectedDate.dateISO) {
        updatedDates.push({
          ...currentDate,
          plannedDistance: copiedDate.plannedDistance,
          plannedDistanceMeters: copiedDate.plannedDistanceMeters,
          workout: copiedDate.workout,
          workoutCategory: copiedDate.workoutCategory,
        })
      } else {
        updatedDates.push({
          ...currentDate,
        })
      }
    }

    // Replace the selectedDate's week object with the correct plannedDistance value
    // Find the week the selected date belongs to
    let newPlannedDistance = 0
    const selectedDateDT = DateTime.fromISO(selectedDate.dateISO, {
      zone: 'utc',
    })

    const selectedDateWeek = currentWeeks.find((week) => {
      const weekStartDT = DateTime.fromISO(week.startDateISO, { zone: 'utc' })
      const nextWeekStartDT = weekStartDT.plus({ days: 7 })

      if (weekStartDT <= selectedDateDT && selectedDateDT < nextWeekStartDT) {
        // Calculate the plannedDistance for this week but use the copiedDate's distance instead for the selectedDate
        for (let currentDate of currentDates) {
          const currentDateDT = DateTime.fromISO(currentDate.dateISO, {
            zone: 'utc',
          })

          // Is this date in the current week?
          if (weekStartDT <= currentDateDT && currentDateDT < nextWeekStartDT) {
            // Should we use the current date's value, or the copied dates?
            if (currentDate.dateISO === selectedDate.dateISO) {
              newPlannedDistance += copiedDate.plannedDistance
            } else {
              newPlannedDistance += currentDate.plannedDistance
            }
          }
        }

        return true
      }

      return false
    })

    let updatedWeeks = []
    for (let currentWeek of currentWeeks) {
      if (currentWeek.startDateISO === selectedDateWeek.startDateISO) {
        updatedWeeks.push({
          ...currentWeek,
          plannedDistance: newPlannedDistance,
        })
      } else {
        updatedWeeks.push({
          ...currentWeek,
        })
      }
    }

    // Finally, update the training plan with the changes to dates and weeks arrays
    updatePlan({
      weeks: updatedWeeks,
      dates: updatedDates,
    })
  }

  // Updates the training plan by hitting the API with the changes from this copied week
  const pasteWeek = (
    selectedWeek,
    copiedWeek,
    copiedDates,
    currentWeeks,
    currentDates
  ) => {
    if (selectedWeek == null) {
      return console.error('Cannot paste week: selectedWeek is required')
    }

    if (copiedWeek == null) {
      return console.error('Cannot paste week: copiedWeek is required')
    }

    if (copiedDates == null) {
      return console.error('Cannot paste week: copiedDates is required')
    }

    if (currentWeeks == null) {
      return console.error('Cannot paste week: currentWeeks is required')
    }

    if (currentDates == null) {
      return console.error('Cannot paste week: currentDates is required')
    }

    // GENERATE AN UPDATED WEEKS ARRAY
    // For each week in current weeks:
    //   If the week matches the selected week, then change its values to the copied week
    //   Else use the current week values
    let updatedWeeks = []
    for (let currentWeek of currentWeeks) {
      if (currentWeek.startDateISO === selectedWeek.startDateISO) {
        updatedWeeks.push({
          ...currentWeek,
          plannedDistance: copiedWeek.plannedDistance,
          percentChange: copiedWeek.percentChange,
        })
      } else {
        updatedWeeks.push({
          ...currentWeek,
        })
      }
    }

    // GENERATE AN UPDATED DATES ARRAY
    // For each date in current dates,
    //   If the date is in the selectedDates array (it's in the selected week):
    //     Find the date in the copied dates array that matches this
    //   Else use the current date object

    // Which ISO dates are we replacing?
    const selectedWeekStartDT = DateTime.fromISO(selectedWeek.startDateISO, {
      zone: 'utc',
    })
    const selectedWeekEndDT = selectedWeekStartDT.plus({ days: 7 })
    let thisDT
    let selectedWeekDates = currentDates.filter((date) => {
      thisDT = DateTime.fromISO(date.dateISO, { zone: 'utc' })
      return selectedWeekStartDT <= thisDT && thisDT < selectedWeekEndDT
    })

    const selectedWeekISODates = selectedWeekDates.map((date) => {
      return date.dateISO
    })

    // Which ISO dates are being copied from?
    copiedDates.sort((dateA, dateB) => {
      return DateTime.fromISO(dateA.dateISO) - DateTime.fromISO(dateB)
    })
    const copiedWeekISODates = copiedDates.map((copiedDate) => {
      return copiedDate.dateISO
    })

    let updatedDates = []
    for (let currentDate of currentDates) {
      let foundDateIndex = selectedWeekISODates.indexOf(currentDate.dateISO)

      if (foundDateIndex >= 0) {
        // Find the date object from the copied date with the same position in the week (same foundIndex)
        const copiedDateAtFoundIndex = copiedDates.find((dateObj) => {
          return dateObj.dateISO === copiedWeekISODates[foundDateIndex]
        })

        // Replace the selected date values with the copied date values
        updatedDates.push({
          ...currentDate,
          plannedDistance: copiedDateAtFoundIndex.plannedDistance,
          workout: copiedDateAtFoundIndex.workout,
          workoutCategory: copiedDateAtFoundIndex.workoutCategory,
        })
      } else {
        // The currentDate is not in the selected week, so we should use the current value
        updatedDates.push({
          ...currentDate,
        })
      }
    }

    // Finally, update the training plan with the changes to dates and weeks arrays
    updatePlan({
      weeks: updatedWeeks,
      dates: updatedDates,
    })
  }

  useEffect(() => {
    if (disableSelection) {
      setSelectedWeekIndex(null)
      setSelectedDateISO(null)
      setHoveringWeekIndex(null)
      setAllowCopy(false)
      setAllowPaste(false)
      setCopiedDate(null)
      setCopiedWeek({
        exists: false,
        week: null,
        dates: null,
      })
    }
  }, [disableSelection])

  // Handle keyboard shortcut event listeners for copy and paste actions.
  useEffect(() => {
    // CMD+C or Ctrl+C => Copy shortcut
    const handleCopyShortcut = (event) => {
      if (event.keyCode === 67 && (event.metaKey || event.ctrlKey)) {
        onCopyClick()
      }
    }

    // CMD+V or Ctrl+V => Paste shortcut
    const handlePasteShortcut = (event) => {
      if (event.keyCode === 86 && (event.metaKey || event.ctrlKey)) {
        onPasteClick()
      }
    }

    window.addEventListener('keydown', handleCopyShortcut)
    window.addEventListener('keydown', handlePasteShortcut)

    return () => {
      window.removeEventListener('keydown', handleCopyShortcut)
      window.removeEventListener('keydown', handlePasteShortcut)
    }
  }, [allowCopy, allowPaste, selectedWeekIndex, selectedDateISO])

  return (
    <div className='z-0 flex w-[1536px] flex-col px-4 pb-12'>
      {!disableSelection && showCopyPasteBox ? (
        <div className='fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 justify-center space-x-4 rounded border border-neutral-400 bg-neutral-800 px-4 py-2 drop-shadow-lg'>
          <button
            className={copyBtnClasses}
            disabled={!allowCopy}
            onClick={() => onCopyClick()}
          >
            {copyText}
          </button>
          <button
            className={pasteBtnClasses}
            disabled={!allowPaste}
            onClick={() => onPasteClick()}
          >
            {pasteText}
          </button>
        </div>
      ) : null}

      <CalendarHeaderRow />

      {training.weeks.map((week, weekIndex) => {
        const dates = []
        const dateIndexes = [0, 1, 2, 3, 4, 5, 6]

        dateIndexes.map((dateIndex) => {
          dates.push(training.dates[weekIndex * 7 + dateIndex])
        })

        const isLastRow = weekIndex + 1 === training.weeks.length

        return (
          <CalendarWeekRow
            key={weekIndex}
            dates={dates}
            weekIndex={weekIndex}
            isLastRow={isLastRow}
            selectedDateISO={selectedDateISO}
            selectedWeekIndex={selectedWeekIndex}
            hoveringWeekIndex={hoveringWeekIndex}
            focusWeekIndex={focusWeekIndex}
            handleMouseEnter={() => setHoveringWeekIndex(weekIndex)}
            handleMouseLeave={() => setHoveringWeekIndex(null)}
            handleDateMenuOpen={() => {
              setSelectedWeekIndex(null)
              setSelectedDateISO(null)
            }}
            handleWeekFocus={() => {
              setFocusWeekIndex(weekIndex)
            }}
            onWeekClick={onWeekClick}
            onDateEdit={onDateEdit}
            onDateClick={onDateClick}
            disableSelection={disableSelection}
            actualMileage={formatActualMileage(
              weekDisplayDistances[weekIndex] || 0
            )}
            percentDiff={formatPercentDiff(weekPercentDiff[weekIndex] || 0)}
          />
        )
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
  updatePlan: PropTypes.func.isRequired, // Callback to update the training plan in the database
}

export default TrainingCalendar
