import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { APIv1 } from '../../api'

import StravaImport from './StravaImport'

const ListPage = () => {
  const [runs, setRuns] = useState()
  const [stravaRuns, setStravaRuns] = useState()
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  // Send API call to log the user in with their email and password
  const getRuns = () => {
    APIv1.get('/runs')
      .then((response) => {
        setRuns(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

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
    <div className='ListPage px-4 space-y-4'>
      <section className='space-y-2'>
        <div>
          <h2 className='text-lg'>Runlog.dev runs</h2>

          {runs && runs.length > 0 && (
            <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
              {runs && JSON.stringify(runs, null, 2)}
            </pre>
          )}
        </div>

        <button
          className='px-4 py-2 border text-white border-gray-900 rounded bg-red-700 hover:bg-red-600 transition'
          onClick={getRuns}
        >
          Get Runs
        </button>
      </section>

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
              className='px-4 py-2 border text-white border-gray-900 rounded bg-red-700 hover:bg-red-600 transition'
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
