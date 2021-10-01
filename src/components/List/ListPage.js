import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

// Third Party UI components
import Switch from 'react-switch'

// Colors - should probably pull this from Tailwind
const eggplant700 = '#7A2A46'

// Components
import StravaImport from './StravaImport'
import RunTableHeaders from './RunTableHeaders'
import RunTableRows from './RunTableRows'
import DailyStatsTableHeaders from './DailyStatsTableHeaders'
import DailyStatsTableRows from './DailyStatsTableRows'

const ListPage = () => {
  const [stravaRuns, setStravaRuns] = useState()
  const auth = useContext(AuthContext)[0]
  const [state, dispatch] = useContext(StateContext)
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth
  const [groupByDate, setGroupByDate] = useState(true)

  if (
    state == null ||
    state.runs === null ||
    state.runs.byId === null ||
    state.dailyStats.byId === null
  ) {
    return <div className='ListPage w-full px-4 pb-4'></div>
  }

  // When this component is loaded, go get the user's Runlog runs (all of them at once)
  useEffect(() => {
    dispatch({
      type: actions.GET_ALL_RUNS__START,
    })

    dispatch({
      type: actions.GET_ALL_DAILY_STATS__START,
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

    APIv1.get('/dailyStats')
      .then((response) => {
        dispatch({
          type: actions.GET_ALL_DAILY_STATS__SUCCESS,
          dailyStats: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_DAILY_STATS__ERROR,
          error: error,
        })
      })
  }, [])

  useState()

  // Tell Runlog API to talk to Strava and get the most recent run activities
  const getRecentStravaRuns = () => {
    // Go get the full user information
    APIv1.get('/strava/runs')
      .then((response) => {
        setStravaRuns(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='ListPage w-full px-4 pb-4 space-y-4'>
      <div>
        <label className='inline-flex items-center space-x-2'>
          <span>Group by date</span>
          <Switch
            onChange={() => {
              setGroupByDate(!groupByDate)
            }}
            checked={groupByDate}
            uncheckedIcon={false}
            checkedIcon={false}
            activeBoxShadow={null}
            onColor={eggplant700}
            height={20}
            width={40}
          />
        </label>
      </div>

      {groupByDate && (
        <section className='grid grid-cols-daily-stats-page'>
          <DailyStatsTableHeaders />
          <DailyStatsTableRows
            dailyStats={state.dailyStats.byId}
            isLoading={state.dailyStats.isLoading}
          />
        </section>
      )}

      {!groupByDate && (
        <section className='grid grid-cols-runs-page'>
          <RunTableHeaders />
          <RunTableRows
            runs={state.runs.byId}
            isLoading={state.runs.isLoading}
          />
        </section>
      )}

      {hasStravaAccount && (
        <>
          <section className='space-y-2'>
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
              onClick={getRecentStravaRuns}
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

export default ListPage
