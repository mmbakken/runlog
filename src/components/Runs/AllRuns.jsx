import React, { useEffect, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import RunFilters from './RunFilters'
import RunTableHeaders from './RunTableHeaders'
import RunTableBody from './RunTableBody'

const AllRuns = () => {
  const [state, dispatch] = useContext(StateContext)
  const location = useLocation()
  const history = useHistory()

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

  // Check for filter query params in the URL. If present, set the filters they call for and then
  // remove the query params
  useEffect(() => {
    if (location && location.search.length) {
      const searchParams = new URLSearchParams(location.search)
      const dateParam = searchParams.get('date')
      const dt = DateTime.fromISO(dateParam)

      if (dt.isValid) {
        dispatch({
          type: actions.SET_RUN_FILTERS__START_DATE,
          startDate: dt.toISODate(),
        })

        history.replace(`${location.pathname}`)
      }
    }
  }, [location])

  return (
    <div className='AllRuns w-full pb-4 sm:w-auto w-full'>
      <RunFilters />

      <section className='overflow-scroll sm:space-y-0 sm:grid sm:grid-cols-runs-page'>
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
