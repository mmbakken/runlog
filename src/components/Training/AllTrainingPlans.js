import React, { useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
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
          training: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_TRAINING__ERROR,
          training: error,
        })
      })
  }, [])

  if (state.training.isFetching) {
    return (
      <div className='TrainingPage w-full px-4 pb-4'>
        {state.training.isFetching && <span>Loading...</span>}
      </div>
    )
  }

  // If there are no training plans, redirect to the creation page
  if (Object.keys(state.training.byId).length === 0) {
    return <Redirect to={{ pathname: CreateTrainingRoute }} />
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div>
        <h1>All Training Plans</h1>
      </div>
    </div>
  )
}

export default AllTrainingPlans
