import React, { useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'
import { AllTrainingPlansRoute } from '../../constants/routes'

const CurrentTrainingPlan = () => {
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

  if (state.isFetching) {
    return (
      <div className='TrainingPage w-full px-4 pb-4'>
        {state.training.isFetching && <span>Loading...</span>}
      </div>
    )
  }

  // If there are plans but no current one, redirect to the AllPlans page
  if (state.training.activePlan == null) {
    return <Redirect to={{ pathname: AllTrainingPlansRoute }} />
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      <div>
        <h1>Current Training Plan</h1>
      </div>
    </div>
  )
}

export default CurrentTrainingPlan
