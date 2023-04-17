import React, { useEffect, useContext } from 'react'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import RunFilters from './RunFilters'
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

  return (
    <div className='AllRuns w-full pb-4 space-y-4 overflow-auto w-full'>
      <h1 className='mx-4 text-2xl'>All Runs</h1>

      <RunFilters />

      <section className='overflow-scroll grid grid-cols-runs-page'>
        <RunTableHeaders />
        <RunTableBody
          runsById={state.runs.byId}
          filteredIds={state.runs.filteredIds}
          isLoading={state.runs.isFetching}
        />
      </section>
    </div>
  )
}

export default AllRuns
