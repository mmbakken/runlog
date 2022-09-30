import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { CreateTrainingRoute } from '../../constants/routes'

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

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div>
        <h1 className='text-xl mb-4'>All Training Plans</h1>

        {state.training.isFetching && (
          <div>
            <span>Loading...</span>
          </div>
        )}

        {!state.training.isFetching &&
          state.training.byId &&
          Object.values(state.training.byId).length > 0 && (
            <div className='mb-4'>
              <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
                {JSON.stringify(state.training.byId, null, 2)}
              </pre>
              {Object.keys(state.training.byId).map((index, id) => {
                return <div key={index}>{state.training.byId[id]}</div>
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
        <Link to={CreateTrainingRoute} className='underline hover:pointer'>
          New Training Plan
        </Link>
      </div>
    </div>
  )
}

export default AllTrainingPlans
