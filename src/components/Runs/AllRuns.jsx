import React, { useEffect, useContext } from 'react'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import RunTableHeaders from './RunTableHeaders'
import RunTableBody from './RunTableBody'

const AllRuns = () => {
  const [state, dispatch] = useContext(StateContext)

  // When this component is loaded, go get the user's Runlog runs (all of them at once)
  useEffect(() => {
    dispatch({
      type: actions.GET_ALL_RUNS__START,
    })

    APIv1.get('/runs')
      .then((response) => {
        dispatch({
          type: actions.GET_ALL_RUNS__SUCCESS,
          runs: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_RUNS__ERROR,
          error: error,
        })
      })
  }, [])

  if (state == null || state.runs === null || state.runs.byId === null) {
    return null
  }

  return (
    <div className='AllRuns w-full pb-4 space-y-4 overflow-auto w-full'>
      <h1 className='mx-4 text-2xl'>All Runs</h1>

      <section className='overflow-scroll grid grid-cols-runs-page'>
        <RunTableHeaders />
        <RunTableBody runs={state.runs.byId} isLoading={state.runs.isLoading} />
      </section>
    </div>
  )
}

export default AllRuns
