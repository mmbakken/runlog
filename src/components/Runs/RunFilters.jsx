import React, { useContext } from 'react'
import { DateTime } from 'luxon'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'

import Button from '../UI/Button'

const RunFilters = () => {
  const [state, dispatch] = useContext(StateContext)
  const todayISODate = DateTime.local().toISODate()

  if (state == null || state.runs == null || state.runs.filters == null) {
    return null
  }

  // For the maxDistance input, the min attribute value should either be 0 or the minimum selected
  // distance value, if present.
  let minMaxDistanceValue = 0
  if (state.runs.filters.distance.value !== '') {
    minMaxDistanceValue = state.runs.filters.distance.value
  }

  // For the distance input (aka min distance), the max attribute value should be either 100 or the
  // selected max distance value, if present.
  let maxMinDistanceValue = 100
  if (state.runs.filters.distance.maxValue !== '') {
    maxMinDistanceValue = state.runs.filters.distance.maxValue
  }

  const onDateChange = (newDate, isStartDate) => {
    // UX: Clearing the start date requires clearing the end date. Clearing the endDate value is
    // just treated like any other value update, since a valid startDate and null endDate is a
    // valid combo of filters.
    if (isStartDate && newDate === '') {
      dispatch({
        type: actions.CLEAR_RUN_FILTERS__START_DATE,
        startDate: newDate,
      })

      return
    }

    if (isStartDate) {
      dispatch({
        type: actions.SET_RUN_FILTERS__START_DATE,
        startDate: newDate,
      })
    } else {
      dispatch({
        type: actions.SET_RUN_FILTERS__END_DATE,
        endDate: newDate,
      })
    }
  }

  const onDistanceChange = (newDistance, isMax) => {
    if (isMax) {
      dispatch({
        type: actions.SET_RUN_FILTERS__DISTANCE_MAX_VALUE,
        maxValue: newDistance,
      })
    } else {
      dispatch({
        type: actions.SET_RUN_FILTERS__DISTANCE_VALUE,
        value: newDistance,
      })
    }
  }

  const onDistanceMatchTypeChange = (newType) => {
    dispatch({
      type: actions.SET_RUN_FILTERS__DISTANCE_MATCH_TYPE,
      matchType: newType,
    })
  }

  const onResetButtonClick = () => {
    dispatch({
      type: actions.CLEAR_RUN_FILTERS__ALL,
    })
  }

  return (
    <div className='RunFilters mb-2 flex w-full flex-col space-y-4 pb-2 md:mb-4 md:flex-row'>
      <div className='md:align-center flex w-full flex-col items-center md:w-auto md:flex-row'>
        <div className='flex w-full md:mt-0 md:w-auto'>
          <label className='mx-4 text-sm md:text-base'>
            Start Date
            <input
              type='date'
              max={todayISODate}
              value={state.runs.filters.startDate}
              onChange={(e) => onDateChange(e.target.value, true)}
              className='mt-1 block h-10 w-36 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm md:mt-2'
            />
          </label>

          {state.runs.filters.startDate === '' ? null : (
            <label className='mr-4 text-sm md:text-base'>
              End Date
              <input
                type='date'
                value={state.runs.filters.endDate}
                min={state.runs.filters.startDate}
                max={todayISODate}
                onChange={(e) => onDateChange(e.target.value, false)}
                className='mt-1 block w-36 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm md:mt-2'
              />
            </label>
          )}
        </div>

        <div className='mt-2 flex w-full md:mt-0 md:w-auto'>
          <label className='mx-4 text-sm md:mx-0 md:text-base'>
            Distance
            <div className='mt-1 flex items-center md:mt-2'>
              <select
                className='mr-4 block h-10 w-28 cursor-pointer rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm'
                value={state.runs.filters.distance.matchType}
                onChange={(e) => onDistanceMatchTypeChange(e.target.value)}
              >
                <option>Between</option>
                <option>Less Than</option>
                <option>More Than</option>
                <option>Exactly</option>
              </select>

              <input
                type='number'
                min='0'
                max={maxMinDistanceValue}
                value={state.runs.filters.distance.value}
                onChange={(e) => onDistanceChange(e.target.value, false)}
                className='mr-2 block h-10 w-10 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-center text-sm'
              />
              {state.runs.filters.distance.matchType === 'Between' ? null : (
                <span className=''>miles</span>
              )}

              {state.runs.filters.distance.matchType === 'Between' ? (
                <>
                  <span>and</span>
                  <input
                    type='number'
                    min={minMaxDistanceValue}
                    max='100'
                    value={state.runs.filters.distance.maxValue}
                    onChange={(e) => onDistanceChange(e.target.value, true)}
                    className='mx-2 block h-10 w-10 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-center text-sm'
                  />
                  <span className=''>miles</span>
                </>
              ) : null}
            </div>
          </label>
        </div>

        <div className='mx-4 mt-4 self-start md:mt-8 md:self-center'>
          <Button onClick={onResetButtonClick} type='inline'>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RunFilters
