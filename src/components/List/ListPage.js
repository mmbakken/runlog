import React, { useState, useEffect, useContext } from 'react'
import { DateTime, Duration } from 'luxon'
import { AuthContext } from '../../context/AuthContext'
import { APIv1 } from '../../api'

import {
  SECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  METERS_PER_MILE,
  METERS_PER_SECOND_TO_MINUTES_PER_MILE,
} from '../../constants/unitConversion.js'

// Components
import StravaImport from './StravaImport'

const ListPage = () => {
  const [runs, setRuns] = useState()
  const [stravaRuns, setStravaRuns] = useState()
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  // When this component is loaded, go get the user's Runlog runs (all of them at once)
  useEffect(() => {
    getRuns()
  }, [])

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

  // Convert meters per second into minutes per mile, as a string to display to humans.
  const formatPace = (speed) => {
    // Solve for x, given speed:
    //
    // 26.8224 min/mi       x min/mi             26.8224 min/mi
    // --------------- === ----------- => x === ----------------
    //     1 m/s            speed m/s                 speed

    const minutesPerMile = METERS_PER_SECOND_TO_MINUTES_PER_MILE / speed
    return (
      Duration.fromMillis(
        minutesPerMile * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
      ).toFormat('m:ss') + '/mi'
    )
  }

  return (
    <div className='ListPage w-full px-4 pb-4 space-y-4'>
      {runs && runs.length > 0 && (
        <section className='grid grid-cols-list-page'>
          <div className='contents'>
            <div>Date</div>
            <div>Miles</div>
            <div>Weekly</div>
            <div>7 Day</div>
            <div>Time</div>
            <div>Pace</div>
            <div>Avg HR</div>
            <div>Max HR</div>
            <div>Results</div>
            <div>Shoes</div>
            <div>Ice</div>
            <div>Stretch</div>
            <div>Lift</div>
            <div>Link</div>
          </div>

          {runs
            .sort((a, b) => {
              return a.startDate < b.startDate ? 1 : -1
            })
            .map((run, index) => {
              return (
                <div key={index} className='contents'>
                  <div>
                    {DateTime.fromISO(run.startDate).toLocaleString(
                      DateTime.DATE_FULL
                    )}
                  </div>
                  <div>
                    {Number(run.distance / METERS_PER_MILE)
                      .toFixed(2)
                      .toLocaleString()}
                  </div>
                  <div>todo</div>
                  <div>todo</div>
                  <div>
                    {Duration.fromMillis(run.time * 1000).toFormat('h:mm:ss')}
                  </div>
                  <div>{formatPace(run.averageSpeed)}</div>
                  <div>{run.averageHeartRate}</div>
                  <div>{run.maxHeartRate}</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div>-</div>
                  <div>
                    <a
                      target='_blank'
                      rel='noopener noreferrer'
                      href={`https://connect.garmin.com/modern/activity/${run.stravaExternalId.substring(
                        12
                      )}`}
                    >
                      Details
                    </a>
                  </div>
                </div>
              )
            })}
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
              className='px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition'
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
