import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { CreateTrainingRoute, ViewTrainingPlanRoute } from 'app/routes'

import {
  formatActualMileage,
  formatPlannedMileage,
} from '../../formatters/formatMileage.js'

import Button from '../UI/Button'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)
  const navigate = useNavigate()

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
    navigate(ViewTrainingPlanRoute.split(':')[0].concat(id))
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div className='w-full'>
        <h1 className='mb-4 text-2xl'>All Training Plans</h1>

        {state.training.isFetching ? (
          <div>
            <span>Loading...</span>
          </div>
        ) : null}

        {state.training.byId &&
        Object.values(state.training.byId).length > 0 ? (
          <div className='mb-6 grid w-full grid-cols-(--plans-page) gap-x-6 gap-y-2'>
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
                      <div className='col-span-2'>Title</div>
                      <div>Start Date</div>
                      <div>End Date</div>
                      <div>Weeks</div>
                      <div>Mileage</div>
                      <div>Planned</div>
                    </div>
                  )
                }

                rows.push(
                  <div key={index} className='contents'>
                    <div>
                      <span
                        className='cursor-pointer hover:underline'
                        onClick={() => {
                          onViewClick(training._id)
                        }}
                      >
                        {training.title}
                      </span>
                    </div>
                    <div>
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
                    <div>
                      {DateTime.fromISO(training.startDate, {
                        zone: 'utc',
                      }).toLocaleString()}
                    </div>
                    <div>
                      {DateTime.fromISO(training.endDate, {
                        zone: 'utc',
                      }).toLocaleString()}
                    </div>
                    <div className='text-center'>{training.weeks.length}</div>
                    <div>{formatActualMileage(training.actualDistance)} mi</div>
                    <div>
                      {formatPlannedMileage(training.plannedDistance)} mi
                    </div>
                  </div>
                )

                return rows
              })}
          </div>
        ) : null}

        {!state.training.isFetching &&
          (state.training.byId == null ||
            Object.values(state.training.byId).length === 0) && (
            <div className='mb-4'>No training plans found.</div>
          )}
      </div>

      <div>
        <Button
          type='primary'
          onClick={() => {
            navigate(CreateTrainingRoute)
          }}
        >
          New Training Plan
        </Button>
      </div>
    </div>
  )
}

export default AllTrainingPlans
