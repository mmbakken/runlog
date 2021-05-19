import React, { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { DateTime } from 'luxon'
import reverse from 'reverse-geocode'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

// Unit formatting helper functions
import formatMileage from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'

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

  const run = state.runs.byId[params.runId]

  if (run == null) {
    return <div className='RunPage w-full'></div>
  }

  // Given a timezone string from Strava e.g. "(GMT-06:00) America/Chicago", returns a string that
  // that is Luxon-compatible e.g. "America/Chicago".
  // See: https://moment.github.io/luxon/docs/manual/zones.html#creating-datetimes-in-a-zone
  // Also: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  const stravaTimezoneToTZ = (stravaTimezoneString) => {
    return stravaTimezoneString.split(' ')[1]
  }

  // Given a run, returns a title string to use, based on the time of day
  const generateTitle = (runStartTime, timezone) => {
    const dt = DateTime.fromISO(runStartTime, { zone: timezone })

    // Thresholds
    const startOfMorning = dt.set({ hour: 4, minute: 0, second: 0 })
    const startOfAfternoon = dt.set({ hour: 12, minute: 0, second: 0 })
    const startOfEvening = dt.set({ hour: 17, minute: 0, second: 0 })
    const startOfLateNight = dt.set({ hour: 22, minute: 0, second: 0 })

    if (dt < startOfMorning || dt >= startOfLateNight) {
      return 'Late Night Run'
    } else if (dt < startOfAfternoon) {
      return 'Morning Run'
    } else if (dt < startOfEvening) {
      return 'Afternoon Run'
    } else {
      return 'Evening Run'
    }
  }

  // Given some run data, returns a string to use as the subheader for this page.
  const generateSubheader = (runStartTime, timezone, lat, lng) => {
    const dateTime = DateTime.fromISO(runStartTime, {
      zone: stravaTimezoneToTZ(timezone),
    }).toLocaleString(DateTime.DATETIME_FULL)

    // NB: This only works for locations in the US. It's gonna give terrible data otherwise.
    const location = reverse.lookup(lat, lng, 'us')

    if (
      location == null ||
      location.city == null ||
      location.state_abbr == null
    ) {
      return dateTime
    }

    return `${dateTime} in ${location.city}, ${location.state_abbr}`
  }

  return (
    <div className='RunPage w-full px-4 pb-4 space-y-4'>
      <header>
        <h1 className='text-2xl'>
          {generateTitle(run.startDate, stravaTimezoneToTZ(run.timezone))}
        </h1>
        <h2 className='text-gray-500'>
          {generateSubheader(
            run.startDate,
            run.timezone,
            run.startLatitude,
            run.startLongitude
          )}
        </h2>
      </header>

      {state.runs.isFetching && <p>Loading...</p>}

      {!state.runs.isFetching && (
        <section className='flex flex-col items-start space-y-4'>
          <div className='flex p-4 border border-gray-600 text-xl space-x-8'>
            <div>
              <div>{formatMileage(run.distance)}</div>
              <div className='text-base text-gray-600'>miles</div>
            </div>

            <div>
              <div>{formatDuration(run.time)}</div>
              <div className='text-base text-gray-600'>time</div>
            </div>

            <div>
              <div>{formatPace(run.averageSpeed)}</div>
              <div className='text-base text-gray-600'>pace</div>
            </div>

            <div>
              <div>
                {Math.round(run.averageHeartRate)} / {run.maxHeartRate}
              </div>
              <div className='text-base text-gray-600'>heart rate</div>
            </div>
          </div>

          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`https://connect.garmin.com/modern/activity/${run.stravaExternalId.substring(
                12
              )}`}
            >
              View on Garmin
            </a>
          </div>
        </section>
      )}
    </div>
  )
}

export default RunPage
