import React, { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)
  const location = useLocation()
  const id = location.pathname.split('/training/')[1]

  console.log(`id: ${id}`)

  // When this component is loaded, go get all of the training plans
  // TODO: Get the active one first, then get the rest of them second
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
          state.training.byId[id] && (
            <div className='w-full mb-4'>
              <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
                {JSON.stringify(state.training.byId[id], null, 2)}
              </pre>
            </div>
          )}

        {!state.training.isFetching && state.training.byId[id] == null && (
          <div className='mb-4'>No training plan found with id {id}</div>
        )}
      </div>
    </div>
  )
}

export default AllTrainingPlans
