import React, { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

const RunPage = () => {
  const params = useParams()
  const [state, dispatch] = useContext(StateContext)

  // Get the run id in question any time the route param changes (and on first load).
  useEffect(() => {
    dispatch({
      type: actions.GET_RUN__START,
    })

    APIv1.get(`/runs/${params.runId}`)
      .then((response) => {
        dispatch({
          type: actions.GET_RUN__SUCCESS,
          run: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_RUN__ERROR,
          error: error,
        })
      })
  }, [params.runId])

  return (
    <div className='RunPage w-full px-4 pb-4 space-y-4'>
      <h1 className='text-lg'>RunPage</h1>

      {state.runs.isFetching && <p>Loading...</p>}

      {!state.runs.isFetching && (
        <div>
          <pre className='w-48 font-mono'>
            {JSON.stringify(state.runs.byId[params.runId], null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default RunPage
