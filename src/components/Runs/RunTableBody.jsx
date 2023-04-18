import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import RunTableRow from './RunTableRow'

import showWeekDivider from '../../utils/showWeekDivider'

// Given an array of run activities, displays as table content
const RunTableBody = ({ runsById, filteredIds, isLoading }) => {
  if (isLoading) {
    return <div className='w-full mx-4'>Loading...</div>
  }

  if (
    runsById == null ||
    Object.keys(runsById).length === 0 ||
    filteredIds == null ||
    filteredIds.length === 0
  ) {
    return null
  }

  let filteredRunsById = {}
  for (let run of Object.values(runsById)) {
    if (filteredIds.includes(run._id)) {
      filteredRunsById[run._id] = run
    }
  }

  const sortedRuns = Object.values(filteredRunsById).sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1
  })

  return sortedRuns.map((run, rowIndex, runsArray) => {
    // Timeone field has a format like "(GMT-07:00) America/Denver" so just ignore the offset
    const tz = run.timezone.split(' ')[1]

    // Make sure to interpret this run's start date in the timezone that it actually happened,
    // instead of the timezone this browser is in
    const date = DateTime.fromISO(run.startDate, { zone: tz })

    let addWeekBorder = false

    if (runsArray[rowIndex + 1]) {
      let nextDate = DateTime.fromISO(runsArray[rowIndex + 1].startDate, {
        zone: tz,
      })

      addWeekBorder = showWeekDivider(date, nextDate)
    }

    return (
      <RunTableRow key={rowIndex} run={run} showBottomBorder={addWeekBorder} />
    )
  })
}

RunTableBody.propTypes = {
  runsById: PropTypes.object,
  filteredIds: PropTypes.array,
  isLoading: PropTypes.bool,
}

export default RunTableBody
