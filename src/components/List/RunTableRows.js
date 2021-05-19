import React from 'react'
import PropTypes from 'prop-types'
import { DateTime, Duration } from 'luxon'
import { Link } from 'react-router-dom'

import { RunPageRoute } from '../../constants/routes'

// Contants
import {
  SECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  METERS_PER_MILE,
  METERS_PER_SECOND_TO_MINUTES_PER_MILE,
} from '../../constants/unitConversion.js'

// Given an array of run activities, displays the table content as expected for the ListPage
const RunTableRows = ({ runs, isLoading }) => {
  if (runs == null || Object.keys(runs).length === 0) {
    return null
  }

  if (isLoading) {
    return <div className='w-full'>Loading...</div>
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

  // Tailwind classes
  const tableCellClasses = 'px-1 py-1 first:px-0 flex items-center'

  const sortedRuns = Object.values(runs).sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1
  })

  return sortedRuns.map((run, rowIndex) => {
    return (
      <div key={rowIndex} className='RunTableRows table-row contents'>
        <div className={`${tableCellClasses} hover:underline`}>
          <Link to={RunPageRoute.split(':')[0].concat(run._id)}>
            {DateTime.fromISO(run.startDate).toLocaleString(DateTime.DATE_FULL)}
          </Link>
        </div>
        <div className={tableCellClasses}>
          {Number(run.distance / METERS_PER_MILE)
            .toFixed(2)
            .toLocaleString()}
        </div>
        <div className={tableCellClasses}>todo</div>
        <div className={tableCellClasses}>todo</div>
        <div className={tableCellClasses}>
          {Duration.fromMillis(run.time * 1000).toFormat('h:mm:ss')}
        </div>
        <div className={tableCellClasses}>{formatPace(run.averageSpeed)}</div>
        <div className={tableCellClasses}>
          {Math.round(run.averageHeartRate)}
        </div>
        <div className={tableCellClasses}>{run.maxHeartRate}</div>
      </div>
    )
  })
}

RunTableRows.propTypes = {
  runs: PropTypes.object,
  isLoading: PropTypes.bool,
}

export default RunTableRows
