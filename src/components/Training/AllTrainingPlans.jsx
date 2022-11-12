import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faEllipsisV } from '@fortawesome/free-solid-svg-icons'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import {
  CreateTrainingRoute,
  ViewTrainingPlanRoute,
} from '../../constants/routes'

import formatMileage from '../../formatters/formatMileage.js'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)
  const history = useHistory()

  // Which row's option menu is visible?
  const [optionMenuVisibleIndex, setOptionMenuVisibleIndex] = useState(null)

  // When this component is loaded, go get all of the training plans
  // TODO: Get the active one first, then get the rest of them second
  useEffect(() => {
    dispatch({
      type: actions.GET_ALL_TRAINING__START,
    })

    APIv1.get('/training')
      .then((response) => {
        dispatch({
          type: actions.GET_ALL_TRAINING__SUCCESS,
          data: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_TRAINING__ERROR,
          error: error,
        })
      })
  }, [])

  const onViewClick = (id) => {
    history.push(ViewTrainingPlanRoute.split(':')[0].concat(id))
  }

  const onDeleteClick = (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete the training plan "${state.training.byId[id].title}"? This action cannot be undone.`
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
        })
        .catch((error) => {
          dispatch({
            type: actions.DELETE_TRAINING__ERROR,
            error: error,
          })
        })
    }
  }

  const onMenuClick = (index) => {
    setOptionMenuVisibleIndex(index)
  }

  const onMaskClick = () => {
    setOptionMenuVisibleIndex(null)
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div className='w-full'>
        <h1 className='text-2xl mb-4'>All Training Plans</h1>

        {state.training.isFetching && (
          <div>
            <span>Loading...</span>
          </div>
        )}

        {!state.training.isFetching &&
          state.training.byId &&
          Object.values(state.training.byId).length > 0 && (
            <div className='w-full mb-4 grid grid-cols-plans-page gap-x-6 gap-y-2'>
              {Object.values(state.training.byId)
                .sort((planA, planB) => {
                  if (planA.isActive && !planB.isActive) {
                    return -1 // plan A first
                  } else if (!planA.isActive && planB.isActive) {
                    return 1 // plan b first
                  }

                  return (
                    DateTime.fromISO(planA.startDate) -
                    DateTime.fromISO(planB.startDate)
                  )
                })
                .map((training, index) => {
                  // Add a header row
                  const rows = []
                  if (index === 0) {
                    rows.push(
                      <div key='header' className='contents'>
                        <div className=''>Title</div>
                        <div className=''></div>
                        <div className=''>Start Date</div>
                        <div className=''>End Date</div>
                        <div className=''>Weeks</div>
                        <div className=''>Mileage</div>
                        <div className=''>Planned</div>
                        <div className=''></div>
                      </div>
                    )
                  }

                  let optionMenuClasses =
                    'absolute left-8 top-0 border rounded border-gray-900 bg-offwhite-100 z-50'
                  let maskClasses =
                    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0 z-40'
                  if (optionMenuVisibleIndex === index) {
                    optionMenuClasses += ' block'
                    maskClasses += ' block'
                  } else {
                    optionMenuClasses += ' hidden'
                    maskClasses += ' hidden'
                  }

                  rows.push(
                    <div key={index} className='contents'>
                      <div>
                        <span
                          className='cursor-pointer hover:underline hover:text-eggplant-700'
                          onClick={() => {
                            onViewClick(training._id)
                          }}
                        >
                          {training.title}
                        </span>
                      </div>
                      <div className=''>
                        {training.isActive ? (
                          <div>
                            <FontAwesomeIcon
                              icon={faStar}
                              className='mx-2 text-eggplant-700'
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div className=''>
                        {DateTime.fromISO(training.startDate, {
                          zone: 'utc',
                        }).toLocaleString()}
                      </div>
                      <div className=''>
                        {DateTime.fromISO(training.endDate, {
                          zone: 'utc',
                        }).toLocaleString()}
                      </div>
                      <div className='text-center'>{training.weeks.length}</div>
                      <div className=''>
                        {formatMileage(training.actualDistance)} mi
                      </div>
                      <div className=''>
                        {formatMileage(training.plannedDistance)} mi
                      </div>
                      <div className='relative'>
                        <button
                          className='text-xs px-2 py-1 border border-gray-700 rounded bg-offwhite-100 hover:bg-offwhite-200 transition cursor-pointer'
                          onClick={() => {
                            onMenuClick(index)
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>

                        <div className={optionMenuClasses}>
                          <ul className='flex flex-col w-max'>
                            <li
                              className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                              onClick={() => {
                                onViewClick(training._id)
                              }}
                            >
                              View plan
                            </li>
                            <li
                              className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                              onClick={() => {
                                onDeleteClick(training._id)
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
                  )

                  return rows
                })}
            </div>
          )}

        {!state.training.isFetching &&
          (state.training.byId == null ||
            Object.values(state.training.byId).length === 0) && (
            <div className='mb-4'>No training plans found.</div>
          )}
      </div>

      <div>
        <button
          className='text-lg mt-8 px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300'
          onClick={() => {
            history.push(CreateTrainingRoute)
          }}
        >
          New Training Plan
        </button>
      </div>
    </div>
  )
}

export default AllTrainingPlans
