import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'

import { RunPageRoute } from '../../constants/routes'

// Unit formatting helper functions
import formatMileage from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'

// Given an array of run activities, displays the table content as expected for the ListPage
const RunTableRows = ({ runs, isLoading }) => {
  if (runs == null || Object.keys(runs).length === 0) {
    return null
  }

  if (isLoading) {
    return <div className='w-full'>Loading...</div>
  }

  // Tailwind classes
  const tableCellClasses = 'px-1 py-1 first:px-0 flex items-center'

  const sortedRuns = Object.values(runs).sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1
  })

  return sortedRuns.map((run, rowIndex) => {
    return (
      <div key={rowIndex} className='RunTableRows table-row contents'>
        <div className={tableCellClasses}>
          {DateTime.fromISO(run.startDate).toLocaleString(DateTime.DATE_FULL)}
        </div>
        <div className={`${tableCellClasses} hover:underline`}>
          <Link to={RunPageRoute.split(':')[0].concat(run._id)}>
            {run.title}
          </Link>
        </div>
        <div className={tableCellClasses}>{formatMileage(run.distance)}</div>
        <div className={tableCellClasses}>todo</div>
        <div className={tableCellClasses}>todo</div>
        <div className={tableCellClasses}>{formatDuration(run.time)}</div>
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
