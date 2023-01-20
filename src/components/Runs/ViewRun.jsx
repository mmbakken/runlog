import React, { useState, useEffect, useContext } from 'react'

import { toast } from 'react-toastify'

import { useParams, useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'
import reverse from 'reverse-geocode'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { AllRunsRoute } from '../../constants/routes'

// Unit formatting helper functions
import { formatActualMileage } from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'
import formatHeartRate from '../../formatters/formatHeartRate'

// Components
import Checkbox from '../Forms/Checkbox'

const ViewRun = () => {
  const DEBOUNCE_TIME_IN_MS = 500
  const history = useHistory()
  const params = useParams()
  const [state, dispatch] = useContext(StateContext)
  const run = state.runs.byId[params.runId]

  const [allowResultsEdits, setAllowResultsEdits] = useState(false)
  const [resultsText, setResultsText] = useState('')
  const [resultsTimeoutRef, setResultsTimeoutRef] = useState(null)

  const [allowCheckboxEdits, setAllowCheckboxEdits] = useState(false)
  const [isChecked, setIsChecked] = useState({
    stretch: null,
    strength: null,
    ice: null,
  })

  const [allowTitleEdits, setAllowTitleEdits] = useState(false)
  const [isHoveringTitle, setIsHoveringTitle] = useState(false)
  const [showTitleEditField, setShowTitleEditField] = useState(false)
  const [runTitle, setRunTitle] = useState('')

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

  const deleteRun = () => {
    dispatch({
      type: actions.DELETE_RUN__START,
      runId: params.runId,
    })

    APIv1.delete(`/runs/${params.runId}`)
      .then(() => {
        dispatch({
          type: actions.DELETE_RUN__SUCCESS,
          runId: params.runId,
        })

        toast.success('Run deleted', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })

        history.push(AllRunsRoute)
      })
      .catch((error) => {
        dispatch({
          type: actions.DELETE_RUN__ERROR,
          error: error,
        })

        // TODO: Use a toast for this
        console.error(error)
        alert(
          'Something went wrong while deleting this run, please try again later.'
        )
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
      setAllowTitleEdits(true)
      setIsChecked({
        stretch: run.stretch,
        strength: run.strength,
        ice: run.ice,
      })
      setRunTitle(run.title)
    }
  }, [run])

  // Send an update when the run title is changed, by the user defocusing the edit field.
  useEffect(() => {
    if (allowTitleEdits) {
      updateRun({
        updates: {
          title: runTitle,
        },
      })
    }
  }, [showTitleEditField])

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
    return <div className='ViewRun w-full'></div>
  }

  // Given a timezone string from Strava e.g. "(GMT-06:00) America/Chicago", returns a string that
  // that is Luxon-compatible e.g. "America/Chicago".
  // See: https://moment.github.io/luxon/docs/manual/zones.html#creating-datetimes-in-a-zone
  // Also: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  const stravaTimezoneToTZ = (stravaTimezoneString) => {
    return stravaTimezoneString.split(' ')[1]
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
  const resultsFocusHandler = () => {
    setAllowResultsEdits(true)
  }

  // When the user presses ESC, unfocus the results textarea
  const resultsKeyDownHandler = (event) => {
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

  const onTitleMouseEnter = () => {
    setIsHoveringTitle(true)
  }

  const onTitleMouseLeave = () => {
    setIsHoveringTitle(false)
  }

  // When user clicks on the editable title field
  const onTitleClick = () => {
    setShowTitleEditField(true)
  }

  // When user clicks on the editable title field
  const onTitleBlur = () => {
    setShowTitleEditField(false)
  }

  const onTitleChange = (event) => {
    setRunTitle(event.target.value)
  }

  const titleKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      document.activeElement.blur()
      event.preventDefault()
    }
  }

  const handleDeleteButtonClick = (event) => {
    event.preventDefault()

    if (
      confirm(
        'Are you sure you want to delete this run? This action is permanent.'
      )
    ) {
      deleteRun()
    }
  }

  return (
    <div className='ViewRun w-full px-4 pb-4 space-y-4'>
      <header className='w-full'>
        {showTitleEditField && (
          <input
            className='text-2xl px-2 py-1 max-w-full'
            type='text'
            value={runTitle}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            autoFocus
            onKeyDown={titleKeyDownHandler}
            size={30}
          />
        )}

        {!showTitleEditField && (
          <h1 className='truncate'>
            <span
              onMouseEnter={onTitleMouseEnter}
              onMouseLeave={onTitleMouseLeave}
              onClick={onTitleClick}
              className={`text-2xl ${
                isHoveringTitle ? 'underline cursor-pointer' : ''
              }`}
            >
              {runTitle}
              {isHoveringTitle && (
                <FontAwesomeIcon
                  className={'inline-block ml-2'}
                  icon={faEdit}
                />
              )}
            </span>
          </h1>
        )}

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
        <section className='w-screen-xs flex flex-col items-start space-y-6 '>
          <div className='w-full sm:w-auto flex justify-between items-center space-x-4 p-4 border border-gray-900 bg-offwhite-25 text-xl'>
            <div className='flex flex-col items-center'>
              <div>{formatActualMileage(run.distance)}</div>
              <div className='text-base text-gray-600'>miles</div>
            </div>

            <div className='flex flex-col items-center'>
              <div>{formatDuration(run.time)}</div>
              <div className='text-base text-gray-600'>time</div>
            </div>

            <div className='flex flex-col items-center'>
              <div>{formatPace(run.averageSpeed)}</div>
              <div className='text-base text-gray-600'>pace</div>
            </div>

            {run.hasHeartRate && (
              <div className='flex flex-col items-center'>
                <div>
                  {formatHeartRate(run.averageHeartRate)} /{' '}
                  {formatHeartRate(run.maxHeartRate)}
                </div>
                <div className='text-base text-gray-600'>heart rate</div>
              </div>
            )}
          </div>

          <div className='w-full max-w-screen-sm'>
            <label className='w-full text-xl block'>
              Results
              <textarea
                tabIndex='0'
                className='text-base block mt-3 p-2 w-full h-60 sm:h-48 max-h-120 overflow-scroll border rounded border-gray-900 bg-offwhite-25'
                placeholder='How was your run?'
                value={resultsText}
                onFocus={resultsFocusHandler}
                onKeyDown={resultsKeyDownHandler}
                onChange={onResultsChange}
              />
            </label>
          </div>

          <div>
            <span className='text-xl block'>Habits</span>
            <div className='flex flex-col space-y-4 mt-3'>
              <label className='text-lg flex items-center'>
                <Checkbox
                  className='mr-3'
                  onChange={() => onCheckboxChange('stretch')}
                  checked={isChecked.stretch}
                />
                Stretched
              </label>

              <label className='text-lg flex items-center'>
                <Checkbox
                  className='mr-3'
                  onChange={() => onCheckboxChange('strength')}
                  checked={isChecked.strength}
                />
                Strength
              </label>

              <label className='text-lg flex items-center'>
                <Checkbox
                  className='mr-3'
                  onChange={() => onCheckboxChange('ice')}
                  checked={isChecked.ice}
                />
                Iced
              </label>
            </div>
          </div>

          <div>
            <span className='text-xl block'>Actions</span>
            <div className='mt-4 flex flex-col space-y-4'>
              {run.stravaActivityId != null ? (
                <button className='px-4 py-2 text-white border rounded border-eggplant-700 bg-eggplant-700 hover:border-eggplant-600 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300'>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`https://www.strava.com/activities/${run.stravaActivityId}`}
                  >
                    View on Strava
                  </a>
                </button>
              ) : null}

              <button
                className='text-sm px-4 py-2 text-eggplant-700 border rounded border-eggplant-700 bg-offwhite-100 hover:text-white hover:border-eggplant-600 hover:bg-eggplant-600 transition cursor-pointer disabled:cursor-not-allowed disabled:bg-eggplant-300 disabled:border-eggplant-300'
                onClick={(e) => {
                  handleDeleteButtonClick(e)
                }}
              >
                Delete Run
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ViewRun
