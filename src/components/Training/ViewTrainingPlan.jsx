import React, { useState, useEffect, useContext } from 'react'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faStar, faSave } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'
import { useLocation, useHistory } from 'react-router-dom'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'
import { AllTrainingPlansRoute } from '../../constants/routes'

import TrainingCalendar from './TrainingCalendar'
import articlize from '../../utils/articlize.js'

const ViewTrainingPlan = () => {
  const [state, dispatch] = useContext(StateContext)
  const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedPlan, setEditedPlan] = useState(null)
  const location = useLocation()
  const history = useHistory()
  const id = location.pathname.split('/training/')[1]
  const DEBUG = false
  const DAYS_PER_WEEK = 7

  const training = state?.training?.byId[id]

  let planDesc = ''
  if (training != null) {
    planDesc = `${articlize(training.plannedDistance, 'A', 'An')} ${
      training.plannedDistance
    }-mile, ${training.weeks.length}-week training plan from ${DateTime.fromISO(
      training.startDate,
      {
        zone: 'utc',
      }
    ).toLocaleString()} through ${DateTime.fromISO(training.endDate, {
      zone: 'utc',
    }).toLocaleString()}`
  }

  let optionMenuClasses =
    'absolute left-8 top-0 border rounded border-gray-900 bg-offwhite-100 z-50'
  let maskClasses =
    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0 z-40'
  if (isOptionMenuVisible) {
    optionMenuClasses += ' block'
    maskClasses += ' block'
  } else {
    optionMenuClasses += ' hidden'
    maskClasses += ' hidden'
  }

  // Get this training plan
  useEffect(() => {
    dispatch({
      type: actions.GET_TRAINING_PLAN__START,
    })

    APIv1.get(`/training/${id}`)
      .then((response) => {
        dispatch({
          type: actions.GET_TRAINING_PLAN__SUCCESS,
          plan: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_TRAINING_PLAN__ERROR,
          error: error,
        })
      })
  }, [])

  // Duplicate its state in this component for use in edit mode
  useEffect(() => {
    if (state.training.byId[id] != null) {
      setEditedPlan({
        ...state.training.byId[id],

        // UI-specific fields needed
        ui: {
          weekCount: state.training.byId[id].weeks.length,
          startDateISO: DateTime.fromISO(state.training.byId[id].startDate, {
            zone: 'utc',
          }).toISODate(),
          endDateISO: DateTime.fromISO(state.training.byId[id].endDate, {
            zone: 'utc',
          }).toISODate(),
        },

        weeks: [...state.training.byId[id].weeks],
        dates: [...state.training.byId[id].dates],
        journal: [...state.training.byId[id].journal],
      })
    }
  }, [state.training.byId[id]])

  // Allow user to hide the option menu with ESC key or a click outside of the menu
  useEffect(() => {
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

  // Save plan to the db (overwrites all fields)
  const updatePlan = (updates) => {
    dispatch({
      type: actions.UPDATE_TRAINING_PLAN__START,
    })

    APIv1.put(`/training/${training._id}`, {
      updates: updates,
    })
      .then((response) => {
        dispatch({
          type: actions.UPDATE_TRAINING_PLAN__SUCCESS,
          plan: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.UPDATE_TRAINING_PLAN__ERROR,
          error: error,
        })
      })
  }

  const onEditModeClick = () => {
    setIsOptionMenuVisible(false)
    setIsEditMode(true)
    setEditedPlan({
      ...state.training.byId[id],

      // UI-specific fields needed
      ui: {
        weekCount: state.training.byId[id].weeks.length,
        startDateISO: DateTime.fromISO(state.training.byId[id].startDate, {
          zone: 'utc',
        }).toISODate(),
        endDateISO: DateTime.fromISO(state.training.byId[id].endDate, {
          zone: 'utc',
        }).toISODate(),
      },

      weeks: [...state.training.byId[id].weeks],
      dates: [...state.training.byId[id].dates],
      journal: [...state.training.byId[id].journal],
    })
  }

  const onSaveEditsClick = () => {
    // Delete UI-only fields on edited plan
    delete editedPlan.ui

    updatePlan({
      ...editedPlan,
      weeks: [...editedPlan.weeks],
      dates: [...editedPlan.dates],
      journal: [...editedPlan.journal],
    })
    setIsEditMode(false)
  }

  const onCancelEditsClick = () => {
    // TODO: Confirm modal?
    if (
      window.confirm(
        'Are you sure you want to cancel your changes to this training plan? This action cannot be undone.'
      )
    ) {
      setIsOptionMenuVisible(false)
      setIsEditMode(false)

      // Reset changes made while editing
      setEditedPlan({
        ...state.training.byId[id],
        weeks: [...state.training.byId[id].weeks],
        dates: [...state.training.byId[id].dates],
        journal: [...state.training.byId[id].journal],
      })
    }
  }

  const onTitleChange = (value) => {
    setEditedPlan({
      ...editedPlan,
      title: value,
    })
  }

  const onGoalChange = (value) => {
    setEditedPlan({
      ...editedPlan,
      goal: value,
    })
  }

  // Handler to update the start of the training plan
  const onDateChange = (newDate) => {
    // TODO: Need to ensure that the user picks a date which is the start of a week

    const newStartDT = DateTime.fromISO(newDate, { zone: 'utc' })

    if (!newStartDT.isValid) {
      console.error(`Invalid start date selected: ${newDate}`)
      return

      // TODO: Set an error UI state and describe the error to the user
    }

    const newEndDT = newStartDT.plus({
      days: DAYS_PER_WEEK * editedPlan.ui.weekCount - 1,
    })

    // TODO: If this happens it's likely bc the weekCount is not a number
    if (!newEndDT.isValid) {
      console.error('Invalid end date after changing start date!')
      return
    }

    // So the start date and end date have changed. This means we should regenerate the weeks and dates arrays based on the new date range.
    // Wherever possible, we must reuse the current training plan's weeks and dates
    const oldStartDT = DateTime.fromISO(training.startDate, { zone: 'utc' })
    const oldEndDT = DateTime.fromISO(training.endDate, { zone: 'utc' })
    let startOfWeekDT
    let foundWeek
    let weeks = []
    let dates = []

    // For each date between startDT and endDT (there may be none of these), add to the dates array
    let foundDates = training.dates.filter((date) => {
      let existingDT = DateTime.fromISO(date.dateISO, { zone: 'utc' })
      return newStartDT <= existingDT && existingDT <= newEndDT
    })

    for (const date of foundDates) {
      dates.push(date)
    }

    // Find any existing weeks between startDT and endDT and add them. Otherwise add a blank week
    // object before or after the existing weeks, depending on its start date.
    for (let weekIndex = 0; weekIndex < editedPlan.ui.weekCount; weekIndex++) {
      startOfWeekDT = newStartDT.plus({
        days: DAYS_PER_WEEK * weekIndex,
      })

      if (oldStartDT <= startOfWeekDT && startOfWeekDT <= oldEndDT) {
        // This date is in the current range.
        // Find the week in the weeks array with this date as its start date
        // Then find all of the date objects with this date plus the next 6 dates and add them
        foundWeek = training.weeks.find((week) => {
          return DateTime.fromISO(week.startDateISO, { zone: 'utc' }).equals(
            startOfWeekDT
          )
        })

        if (foundWeek == null) {
          console.error(
            'Did not find the week we needed in training.weeks array'
          )
          return
        }

        weeks.push(foundWeek)
      } else {
        // This date is before or after the current range. Append a blank week and 7 blank dates
        weeks.push({
          startDateISO: startOfWeekDT.toISODate(),
          actualDistance: 0, // TODO: This will suck to figure out. Will require an API call to run a query on what runs happened in each new week and their distance
          plannedDistance: 0,
          percentChange: 0, // TODO: Also must update when the actualDistance is calculated
        })

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          dates.push({
            dateISO: startOfWeekDT
              .plus({
                days: dayIndex,
              })
              .toISODate(),
            actualDistance: 0, // TODO: Lol good luck
            plannedDistance: 0,
            workout: '',
            workoutCategory: 0,
          })
        }
      }
    }

    return setEditedPlan({
      ...editedPlan,
      startDate: newStartDT.toISODate(),
      endDate: newEndDT.toISODate(),
      weeks: weeks,
      dates: dates,
      ui: {
        ...editedPlan.ui,
        startDateISO: newStartDT.toISODate(),
        endDateISO: newEndDT.toISODate(),
      },
    })
  }

  // Handler to update the end date of the training plan
  const onWeekCountChange = (newWeekCount) => {
    const startDT = DateTime.fromISO(editedPlan.startDate, { zone: 'utc' })
    const endDT = startDT.plus({
      days: DAYS_PER_WEEK * Number.parseInt(newWeekCount) - 1,
    })

    // Add or remove weeks objects from end of original weeks array
    const weekDiff = Number.parseInt(newWeekCount) - editedPlan.weeks.length

    let weeks = [...editedPlan.weeks]
    let dates = [...editedPlan.dates]

    if (weekDiff > 0) {
      // Adding weeks (and dates) to the end of their arrays
      // For every additional week, add a blank week and 7 blank dates
      for (
        let additionalWeekIndex = 0;
        additionalWeekIndex < weekDiff;
        additionalWeekIndex++
      ) {
        weeks.push({
          startDateISO: editedPlan.ui.startDateISO,
          actualDistance: 0, // TODO: This will suck to figure out. Will require an API call to run a query on what runs happened in each new week and their distance
          plannedDistance: 0,
          percentChange: 0, // TODO: Also must update when the actualDistance is calculated
        })

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          dates.push({
            dateISO: startDT
              .plus({
                days:
                  DAYS_PER_WEEK *
                    (editedPlan.weeks.length + additionalWeekIndex) +
                  dayIndex,
              })
              .toISODate(),
            actualDistance: 0, // TODO: Lol good luck
            plannedDistance: 0,
            workout: '',
            workoutCategory: 0,
          })
        }
      }
    } else {
      // Remove the weeks and dates from the end of the plan since the week count has shrunk
      weeks.splice(weekDiff, -1 * weekDiff)
      dates.splice(7 * weekDiff, -7 * weekDiff)
    }

    setEditedPlan({
      ...editedPlan,
      endDate: endDT.toISODate(),
      weeks: weeks,
      dates: dates,
      ui: {
        ...editedPlan.ui,
        weekCount: newWeekCount,
        endDateISO: endDT.toISODate(),
      },
    })
  }

  // TODO: should I only allow edits to this if in edit mode?
  const onToggleIsActiveClick = (value) => {
    updatePlan({
      isActive: value,
    })
  }

  const onDuplicateClick = () => {
    console.log('TODO onDuplicateClick')
  }

  const onDeleteClick = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the training plan "${training.title}"? This action cannot be undone.`
      )
    ) {
      dispatch({
        type: actions.DELETE_TRAINING__START,
      })

      APIv1.delete(`/training/${id}`)
        .then(() => {
          setIsOptionMenuVisible(false)
          dispatch({
            type: actions.DELETE_TRAINING__SUCCESS,
            id: id,
          })

          // TODO: This should be a toast so the user can see it when the route changes
          console.log(`Deleted training plan with id ${id}`)

          history.push(AllTrainingPlansRoute)
        })
        .catch((error) => {
          setIsOptionMenuVisible(false)
          dispatch({
            type: actions.DELETE_TRAINING__ERROR,
            error: error,
          })
        })
    }
  }

  const onMenuClick = () => {
    setIsOptionMenuVisible(!isOptionMenuVisible)
  }

  const onMaskClick = () => {
    setIsOptionMenuVisible(false)
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      {state.training.isFetching && (
        <div>
          <span>Loading...</span>
        </div>
      )}

      {!state.training.isFetching && state.training.byId && training && (
        <div className='w-full mb-4'>
          <div className='flex space-x-4 mb-4'>
            <div className='basis-2/3 flex flex-col'>
              <div className='flex items-center '>
                {isEditMode ? (
                  <label className='w-full max-w-lg text-lg'>
                    Title
                    <input
                      type='text'
                      autoFocus
                      placeholder='What race are you training for?'
                      value={editedPlan.title}
                      onChange={(e) => onTitleChange(e.target.value)}
                      className='text-base w-full rounded px-2 py-2 block mt-2 border border-gray-900'
                    />
                  </label>
                ) : (
                  <>
                    <h1 className='text-2xl'>{training.title}</h1>
                    <div className='ml-4 relative grow-0 shrink-0'>
                      <button
                        className='text-xs px-2 py-1 border border-gray-700 rounded bg-offwhite-100 hover:bg-offwhite-200 transition cursor-pointer'
                        onClick={() => {
                          onMenuClick()
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>

                      <div className={optionMenuClasses}>
                        <ul className='flex flex-col w-max'>
                          <li
                            className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                            onClick={() => {
                              onEditModeClick()
                            }}
                          >
                            Edit plan
                          </li>
                          <li
                            className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                            onClick={() => {
                              onDuplicateClick()
                            }}
                          >
                            Duplicate plan
                          </li>
                          <li
                            className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                            onClick={() => {
                              onDeleteClick()
                            }}
                          >
                            Delete plan
                          </li>
                        </ul>
                      </div>

                      <div
                        className={maskClasses}
                        onClick={() => {
                          onMaskClick()
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className='flex flex-col'>
                {isEditMode ? (
                  <div className='flex space-x-8 mt-4 mb-2'>
                    <label className='text-lg'>
                      Start Date
                      <input
                        type='date'
                        value={editedPlan.ui.startDateISO}
                        onChange={(e) => onDateChange(e.target.value)}
                        className='text-base rounded px-2 py-2 block mt-1 border border-gray-900'
                      />
                    </label>

                    <label className='text-lg'>
                      Weeks
                      <input
                        type='number'
                        value={editedPlan.ui.weekCount}
                        min='1'
                        max='52'
                        onChange={(e) => onWeekCountChange(e.target.value)}
                        className='text-base text-center rounded px-2 py-2 block mt-1 border border-gray-900'
                      />
                    </label>

                    <label className='text-lg'>
                      End Date
                      <input
                        disabled
                        type='date'
                        value={editedPlan.ui.endDateISO}
                        className='text-base rounded py-2 block mt-1'
                      />
                    </label>
                  </div>
                ) : (
                  <h2 className='text-sm text-gray-500'>{planDesc}</h2>
                )}

                {isEditMode ? (
                  <label className='w-full max-w-lg text-lg'>
                    Goal
                    <input
                      type='text'
                      required
                      placeholder='What do you want to achieve?'
                      value={editedPlan.goal}
                      onChange={(e) => onGoalChange(e.target.value)}
                      className='text-base w-full rounded px-2 py-2 block mt-1 border border-gray-900'
                    />
                  </label>
                ) : (
                  <>
                    <h2 className='mt-1'>Goal: {training.goal}</h2>
                    <h2 className='mt-1'>
                      Mileage: {training.actualDistance} miles
                    </h2>
                  </>
                )}
              </div>
            </div>

            <div className='basis-1/3 text-sm text-right mt-1'>
              {training.isActive ? (
                <span
                  className='bg-offwhite-100 border rounded border-eggplant-700 text-eggplant-700 hover:bg-eggplant-600 hover:text-white transition cursor-pointer px-2 py-1'
                  onClick={() => {
                    onToggleIsActiveClick(false)
                  }}
                >
                  <FontAwesomeIcon className='mr-1' icon={faStar} />
                  <span>Active Plan</span>
                </span>
              ) : (
                <span
                  className='bg-offwhite-100 border rounded border-gray-900 hover:bg-eggplant-600 hover:text-white transition cursor-pointer px-2 py-1'
                  onClick={() => {
                    onToggleIsActiveClick(true)
                  }}
                >
                  <FontAwesomeIcon className='mr-1' icon={faStarOutline} />
                  <span>Inactive Plan</span>
                </span>
              )}
            </div>
          </div>

          {isEditMode && (
            <div className='flex justify-between mb-4'>
              <div className='inline-block space-x-2'>
                <button
                  className='bg-offwhite-100 border rounded border-eggplant-700 text-eggplant-700 hover:bg-eggplant-600 hover:text-white transition cursor-pointer px-2 py-1'
                  onClick={() => {
                    onSaveEditsClick()
                  }}
                >
                  <FontAwesomeIcon className='mr-2' icon={faSave} />
                  <span>Save Edits</span>
                </button>
                <span
                  className='hover:underline cursor-pointer'
                  onClick={() => {
                    onCancelEditsClick()
                  }}
                >
                  Cancel
                </span>
              </div>
            </div>
          )}

          <TrainingCalendar
            training={isEditMode ? editedPlan : training}
            updatePlan={updatePlan}
            disableSelection={isEditMode}
          />

          {DEBUG && (
            <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
              {JSON.stringify(training, null, 2)}
            </pre>
          )}
        </div>
      )}

      {!state.training.isFetching && training == null && (
        <div className='mb-4'>No training plan found with id {id}</div>
      )}
    </div>
  )
}

export default ViewTrainingPlan
