import React, { useContext } from 'react'
import { DateTime } from 'luxon'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'

const RunFilters = () => {
  const [state, dispatch] = useContext(StateContext)
  const todayISODate = DateTime.local().toISODate()

  if (state == null || state.runs == null || state.runs.filters == null) {
    return null
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

  return (
    <div className='RunFilters mx-4 pb-2 space-y-4 w-auto'>
      <div className='flex space-x-4'>
        <label className='text-base'>
          Start Date
          <input
            type='date'
            max={todayISODate}
            value={state.runs.filters.startDate}
            onChange={(e) => onDateChange(e.target.value, true)}
            className='w-36 text-sm rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
          />
        </label>

        {state.runs.filters.startDate === '' ? null : (
          <label className='text-base'>
            End Date
            <input
              type='date'
              value={state.runs.filters.endDate}
              min={state.runs.filters.startDate}
              onChange={(e) => onDateChange(e.target.value, false)}
              className='w-36 text-sm rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
            />
          </label>
        )}
      </div>
    </div>
  )
}

export default RunFilters
