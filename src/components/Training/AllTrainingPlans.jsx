import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import {
  CreateTrainingRoute,
  ViewTrainingPlanRoute,
} from '../../constants/routes'

import {
  formatActualMileage,
  formatPlannedMileage,
} from '../../formatters/formatMileage.js'

import Button from '../UI/Button'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)
  const history = useHistory()

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

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div className='w-full'>
        <h1 className='text-2xl mb-4'>All Training Plans</h1>

        {state.training.isFetching ? (
          <div>
            <span>Loading...</span>
          </div>
        ) : null}

        {state.training.byId &&
        Object.values(state.training.byId).length > 0 ? (
          <div className='w-full mb-6 grid grid-cols-plans-page gap-x-6 gap-y-2'>
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
                      {formatActualMileage(training.actualDistance)} mi
                    </div>
                    <div className=''>
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
            history.push(CreateTrainingRoute)
          }}
        >
          New Training Plan
        </Button>
      </div>
    </div>
  )
}

export default AllTrainingPlans
