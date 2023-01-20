import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

// Components
import StravaImport from './StravaImport'
import RunTableHeaders from './RunTableHeaders'
import RunTableBody from './RunTableBody'

// Tell Runlog API to talk to Strava and get the most recent run activities
const getRecentStravaRuns = () => {
  // Go get the full user information
  APIv1.get('/strava/runs')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
}

const AllRuns = () => {
  const [stravaRuns, setStravaRuns] = useState()
  const auth = useContext(AuthContext)[0]
  const [state, dispatch] = useContext(StateContext)
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

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

      {hasStravaAccount && (
        <>
          <section className='mx-4 space-y-2'>
            <div>
              <h2 className='text-lg'>Recent Strava Runs</h2>

              {stravaRuns && stravaRuns.length > 0 && (
                <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
                  {stravaRuns && JSON.stringify(stravaRuns, null, 2)}
                </pre>
              )}
            </div>

            <button
              className='px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition focus:outline-none'
              onClick={() => {
                setStravaRuns(getRecentStravaRuns)
              }}
            >
              Get Strava Runs
            </button>
          </section>

          <StravaImport />
        </>
      )}
    </div>
  )
}

export default AllRuns
