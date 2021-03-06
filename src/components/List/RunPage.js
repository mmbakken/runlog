import React, { useState, useEffect, useContext } from 'react'
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

// Components
import Checkbox from './Checkbox'

const RunPage = () => {
  const DEBOUNCE_TIME_IN_MS = 500
  const params = useParams()
  const [state, dispatch] = useContext(StateContext)
  const run = state.runs.byId[params.runId]
  const [resultsText, setResultsText] = useState('')
  const [allowResultsEdits, setAllowResultsEdits] = useState(false)
  const [allowCheckboxEdits, setAllowCheckboxEdits] = useState(false)
  const [resultsTimeoutRef, setResultsTimeoutRef] = useState(null)
  const [isChecked, setIsChecked] = useState({
    stretch: null,
    strength: null,
    ice: null,
  })

  // Calls the API endpoint to push changes to the database, and updates the state context if the
  // update is successful. Failure will result in the error object being saved to the global state.
  const updateRun = (updates) => {
    dispatch({
      type: actions.EDIT_RUN__START,
    })

    APIv1.put(`/runs/${params.runId}`, updates)
      .then((response) => {
        dispatch({
          type: actions.EDIT_RUN__SUCCESS,
          run: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.EDIT_RUN__ERROR,
          error: error,
        })
      })
  }

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

  // When the run object is updated in the global state, update our local component state for the
  // user-editable fields. Only do this when an update has not been queued up.
  useEffect(() => {
    if (resultsTimeoutRef == null) {
      setResultsText(run == null || run.results == null ? '' : run.results)
    }

    // Wait for the run to load before sending any updates to API
    if (run != null) {
      setAllowCheckboxEdits(true)
      setIsChecked({
        stretch: run.stretch,
        strength: run.strength,
        ice: run.ice,
      })
    }
  }, [run])

  // If the results text changes in the text area, schedule an update to the API. Cancel any prior
  // planned API call, if there was one.
  useEffect(() => {
    if (allowResultsEdits) {
      clearTimeout(resultsTimeoutRef)

      // In X ms, unless it gets cancelled first, send an API call to save the resultsText to the db
      setResultsTimeoutRef(
        setTimeout(() => {
          // Make the API call to update the result text
          updateRun({
            updates: {
              results: resultsText,
            },
          })
        }, DEBOUNCE_TIME_IN_MS)
      )
    }
  }, [resultsText])

  // When the checkbox state is changed, trigger an API call
  // TODO: this is a little broken when you click super fast but it's fine for now.
  useEffect(() => {
    if (isChecked != null && allowCheckboxEdits) {
      // Just send the checked state of all fields in one API call, since they're trivial to update
      updateRun({
        updates: {
          strength: isChecked.strength,
          stretch: isChecked.stretch,
          ice: isChecked.ice,
        },
      })
    }
  }, [isChecked.strength, isChecked.stretch, isChecked.ice])

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

  const onResultsChange = (event) => {
    // TODO: Debounced API call to update the value of the results field
    setResultsText(event.target.value)
  }

  // When the user focuses on the results textarea, begin allowing updates to the run.results field
  const focusHandler = () => {
    setAllowResultsEdits(true)
  }

  // When the user presses ESC, unfocus the results textarea
  const keyDownHandler = (event) => {
    if (event.key === 'Escape') {
      document.activeElement.blur()
      event.preventDefault()
    }
  }

  // When a checkbox changes state, this function is called and the local component state changes
  const onCheckboxChange = (checkboxId) => {
    setIsChecked({
      ...isChecked,
      [checkboxId]: !isChecked[checkboxId], // flip it
    })
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
          <div className='flex p-4 border border-gray-900 bg-offwhite-25 text-xl space-x-6'>
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

          <div className='w-160'>
            <label className='w-full text-xl block'>
              Results
              <textarea
                tabIndex='0'
                className='text-base block mt-2 p-2 w-full h-48 max-h-120 overflow-scroll border rounded border-gray-900 bg-offwhite-25 focus:outline-none'
                placeholder='How was your run?'
                value={resultsText}
                onFocus={focusHandler}
                onKeyDown={keyDownHandler}
                onChange={onResultsChange}
              />
            </label>
          </div>

          <div className='flex flex-row space-x-8'>
            <label className='text-xl block flex flex-col items-center'>
              Stretched
              <Checkbox
                className='mt-2'
                onChange={() => onCheckboxChange('stretch')}
                checked={isChecked.stretch}
              />
            </label>

            <label className='text-xl block flex flex-col items-center'>
              Strength
              <Checkbox
                className='mt-2'
                onChange={() => onCheckboxChange('strength')}
                checked={isChecked.strength}
              />
            </label>

            <label className='text-xl block flex flex-col items-center'>
              Iced
              <Checkbox
                className='mt-2'
                onChange={() => onCheckboxChange('ice')}
                checked={isChecked.ice}
              />
            </label>
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
