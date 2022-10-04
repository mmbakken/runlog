import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'
import {
  CreateTrainingRoute,
  ViewTrainingPlanRoute,
} from '../../constants/routes'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)

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

  const onDeleteClick = (id) => {
    dispatch({
      type: actions.DELETE_TRAINING__START,
    })

    APIv1.delete(`/training/${id}`)
      .then(() => {
        dispatch({
          type: actions.DELETE_TRAINING__SUCCESS,
          id: id,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.DELETE_TRAINING__ERROR,
          error: error,
        })
      })
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
            <div className='w-full mb-4'>
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
                  return (
                    <div
                      key={index}
                      className='w-full inline-flex border border-eggplant-600 mb-2'
                    >
                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        {training.title}
                      </div>
                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        {DateTime.fromISO(training.startDate).toLocaleString()}
                      </div>
                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        {DateTime.fromISO(training.endDate).toLocaleString()}
                      </div>
                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        {training.isActive ? 'Active' : ''}
                      </div>
                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        <button className='px-6 py-1 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300'>
                          <Link
                            to={ViewTrainingPlanRoute.split(':')[0].concat(
                              training._id
                            )}
                          >
                            View
                          </Link>
                        </button>
                      </div>

                      <div className='px-4 py-2 border-r border-eggplant-600 '>
                        <button
                          onClick={() => {
                            onDeleteClick(training._id)
                          }}
                          className='px-6 py-1 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300'
                        >
                          X
                        </button>
                      </div>
                    </div>
                  )
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
        <Link
          to={CreateTrainingRoute}
          className='text-xl underline hover:pointer'
        >
          New Training Plan
        </Link>
      </div>
    </div>
  )
}

export default AllTrainingPlans
