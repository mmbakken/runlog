import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'

import RunTableRow from './RunTableRow'

import showWeekDivider from '../../utils/showWeekDivider'

// Given an array of run activities, displays as table content
const RunTableBody = ({ runs, isLoading }) => {
  if (runs == null || Object.keys(runs).length === 0) {
    return null
  }

  if (isLoading) {
    return <div className='w-full'>Loading...</div>
  }

  const sortedRuns = Object.values(runs).sort((a, b) => {
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
  runs: PropTypes.object,
  isLoading: PropTypes.bool,
}

export default RunTableBody
