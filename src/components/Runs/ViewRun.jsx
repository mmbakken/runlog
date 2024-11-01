import { useState, useEffect, useContext } from 'react'

import { toast } from 'react-toastify'

import { useParams, useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { AllRunsRoute } from 'app/routes'

// Unit formatting helper functions
import { formatActualMileage } from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'
import formatHeartRate from '../../formatters/formatHeartRate'

// Components
import Checkbox from '../Forms/Checkbox'
import Button from '../UI/Button'
import Dropdown from '../UI/Dropdown'

const DEBOUNCE_TIME_IN_MS = 500

const ViewRun = () => {
  const navigate = useNavigate()
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

  const hasLocation =
    run &&
    run.startLocation &&
    run.startLocation != '' &&
    run.startLocation != null

  // Calls the API endpoint to push changes to the database, and updates the
  // state context if the update is successful. Failure will result in the error
  // object being saved to the global state.
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
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })

        navigate(AllRunsRoute)
      })
      .catch((error) => {
        dispatch({
          type: actions.DELETE_RUN__ERROR,
          error: error,
        })

        toast.error('Error deleting run. Please try again later.', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
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

  // When this component is loaded, go get the user's shoes.
  useEffect(() => {
    if (!dispatch) return

    dispatch({
      type: actions.GET_ALL_SHOES__START,
    })

    APIv1.get('/shoes')
      .then((response) => {
        dispatch({
          type: actions.GET_ALL_SHOES__SUCCESS,
          shoes: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_SHOES__ERROR,
          error: error,
        })
      })
  }, [dispatch])

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
    <div className='ViewRun w-full space-y-4 px-4 pb-4'>
      <header className='w-full'>
        {showTitleEditField && (
          <input
            className='max-w-full px-2 py-1 text-2xl'
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
                isHoveringTitle ? 'cursor-pointer underline' : ''
              }`}
            >
              {runTitle}
              {isHoveringTitle && (
                <FontAwesomeIcon
                  className={'ml-2 inline-block'}
                  icon={faEdit}
                />
              )}
            </span>
          </h1>
        )}

        <p className='flex space-x-1 text-neutral-500'>
          <span>
            {DateTime.fromISO(run.startDate, {
              zone: stravaTimezoneToTZ(run.timezone),
            }).toLocaleString(DateTime.DATETIME_FULL)}
          </span>

          {hasLocation ? (
            <>
              <span>in</span>
              <span>{run.startLocation}</span>
            </>
          ) : null}
        </p>
      </header>

      {state.runs.isFetching && <p>Loading...</p>}

      {!state.runs.isFetching && (
        <section className='w-screen-xs flex flex-col items-start space-y-6'>
          <div className='bg-neutral-25 flex w-full items-center justify-between space-x-4 border border-neutral-500 p-4 text-xl sm:w-auto'>
            <div className='flex flex-col items-center'>
              <div>{formatActualMileage(run.distance)}</div>
              <div className='text-base text-neutral-400'>miles</div>
            </div>

            <div className='flex flex-col items-center'>
              <div>{formatDuration(run.time)}</div>
              <div className='text-base text-neutral-400'>time</div>
            </div>

            <div className='flex flex-col items-center'>
              <div>{formatPace(run.averageSpeed)}</div>
              <div className='text-base text-neutral-400'>pace</div>
            </div>

            {run.hasHeartRate && (
              <div className='flex flex-col items-center'>
                <div>
                  {formatHeartRate(run.averageHeartRate)} /{' '}
                  {formatHeartRate(run.maxHeartRate)}
                </div>
                <div className='text-base text-neutral-400'>heart rate</div>
              </div>
            )}
          </div>

          <div className='w-full max-w-screen-sm'>
            <label className='block w-full text-xl'>
              Results
              <textarea
                tabIndex='0'
                className='mt-3 block h-60 max-h-120 w-full overflow-scroll rounded border border-neutral-200 bg-neutral-800 p-2 text-base sm:h-48'
                placeholder='How was your run?'
                value={resultsText}
                onFocus={resultsFocusHandler}
                onKeyDown={resultsKeyDownHandler}
                onChange={onResultsChange}
              />
            </label>
          </div>

          <div className='w-full sm:w-80'>
            <h2 className='mb-3 block text-xl'>Shoes</h2>
            <Dropdown
              selectedId={run.shoeId}
              options={Object.values(state?.shoes.byId)}
              onSelect={(shoeId) => {
                updateRun({ updates: { shoeId: shoeId } })
              }}
              placeholder='Select shoes'
            />
          </div>

          <div>
            <h2 className='block text-xl'>Habits</h2>
            <div className='mt-3 flex flex-col space-y-4'>
              <label
                className='flex cursor-pointer items-center text-lg'
                onClick={() => {
                  onCheckboxChange('stretch')
                }}
              >
                <Checkbox className='mr-3' checked={isChecked.stretch} />
                Stretched
              </label>

              <label
                className='flex cursor-pointer items-center text-lg'
                onClick={() => {
                  onCheckboxChange('strength')
                }}
              >
                <Checkbox className='mr-3' checked={isChecked.strength} />
                Strength
              </label>

              <label
                className='flex cursor-pointer items-center text-lg'
                onClick={() => {
                  onCheckboxChange('ice')
                }}
              >
                <Checkbox className='mr-3' checked={isChecked.ice} />
                Iced
              </label>
            </div>
          </div>

          <div>
            <h2 className='block text-xl'>Actions</h2>
            <div className='mt-4 flex flex-col space-y-4 text-lg'>
              {run.stravaActivityId != null ? (
                <a
                  className='cursor-pointer font-bold hover:underline'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://www.strava.com/activities/${run.stravaActivityId}`}
                >
                  View on Strava
                </a>
              ) : null}

              <Button
                type='secondary'
                onClick={(e) => {
                  handleDeleteButtonClick(e)
                }}
              >
                Delete Run
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ViewRun
