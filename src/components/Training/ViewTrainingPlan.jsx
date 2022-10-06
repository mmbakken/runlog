import React, { useState, useEffect, useContext } from 'react'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV, faStar } from '@fortawesome/free-solid-svg-icons'
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
  const location = useLocation()
  const history = useHistory()
  const id = location.pathname.split('/training/')[1]
  const DEBUG = false

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
    'absolute left-8 top-0 border rounded border-gray-900 bg-offwhite-100 z-20'
  let maskClasses =
    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0 z-10'
  if (isOptionMenuVisible) {
    optionMenuClasses += ' block'
    maskClasses += ' block'
  } else {
    optionMenuClasses += ' hidden'
    maskClasses += ' hidden'
  }

  useEffect(() => {
    // Allow user to hide the option menu with ESC key or a click outside of the menu
    const handleEscPress = (event) => {
      if (event.keyCode === 27) {
        setIsOptionMenuVisible(false)
      }
    }

    window.addEventListener('keydown', handleEscPress)

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

    // Unregister listeners on dismount
    return () => {
      window.removeEventListener('keydown', handleEscPress)
    }
  }, [])

  const onEditClick = () => {
    console.log('TODO onEditClick')
  }

  const onToggleIsActiveClick = (value) => {
    dispatch({
      type: actions.UPDATE_TRAINING_PLAN__START,
    })

    APIv1.put(`/training/${training._id}`, {
      updates: {
        isActive: value,
      },
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
          dispatch({
            type: actions.DELETE_TRAINING__SUCCESS,
            id: id,
          })

          // TODO: This should be a toast so the user can see it when the route changes
          console.log(`Deleted training plan with id ${id}`)

          history.push(AllTrainingPlansRoute)
        })
        .catch((error) => {
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
          <div className='flex space-x-4 mb-8'>
            <div className='basis-2/3 flex flex-col'>
              <div className='flex items-center '>
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
                          onEditClick()
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
              </div>
              <div className='flex flex-col text-sm'>
                <h2 className='text-gray-500'>{planDesc}</h2>
                <h2 className='mt-1'>Goal: {training.goal}</h2>
                <h2 className='mt-1'>
                  Mileage: {training.actualDistance} miles
                </h2>
              </div>
            </div>

            <div className='basis-1/3 text-sm text-right'>
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

          <TrainingCalendar training={training} />

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
