import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'

import { ViewRunRoute } from '../../constants/routes'

// Unit formatting helper functions
import { formatActualMileage } from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'
import formatHeartRate from '../../formatters/formatHeartRate'
import showWeekDivider from '../../utils/showWeekDivider'

// Given an array of run activities, displays as table content
const RunTableRows = ({ runs, isLoading }) => {
  if (runs == null || Object.keys(runs).length === 0) {
    return null
  }

  if (isLoading) {
    return <div className='w-full'>Loading...</div>
  }

  // Tailwind classes
  const tableCellClasses = 'py-1 flex items-center'

  const sortedRuns = Object.values(runs).sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1
  })

  return sortedRuns.map((run, rowIndex, runsArray) => {
    // Timeone field has a weird format like "(GMT-07:00) America/Denver", just ignore the offset
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
      <>
        <div key={rowIndex} className='RunTableRows table-row contents'>
          <div
            className={`${tableCellClasses} ml-4 pr-2 sm:pr-4 md:pr-8 lg:pr-12`}
          >
            {DateTime.fromISO(run.startDate).toLocaleString({
              weekday: 'long',
              month: 'numeric',
              day: 'numeric',
              year: '2-digit',
            })}
          </div>
          <div
            className={`${tableCellClasses} pr-2 sm:pr-4 md:pr-8 lg:pr-12 hover:underline`}
          >
            <Link to={ViewRunRoute.split(':')[0].concat(run._id)}>
              {run.title}
            </Link>
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-2 sm:pl-4 md:pl-8 lg:pl-12`}
          >
            {formatActualMileage(run.distance)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-2 sm:pl-4 md:pl-8 lg:pl-12`}
          >
            {formatDuration(run.time)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-2 sm:pl-4 md:pl-8 lg:pl-12`}
          >
            {formatPace(run.averageSpeed)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-2 sm:pl-4 md:pl-8 lg:pl-12`}
          >
            {formatHeartRate(run.averageHeartRate)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-2 sm:pl-4 md:pl-8 lg:pl-12 mr-4`}
          >
            {formatHeartRate(run.maxHeartRate)}
          </div>
        </div>

        {addWeekBorder && (
          <div
            key={`${rowIndex}-week-border`}
            className='RunTableRows table-row col-span-7 w-full border-b border-eggplant-700'
          />
        )}
      </>
    )
  })
}

RunTableRows.propTypes = {
  runs: PropTypes.object,
  isLoading: PropTypes.bool,
}

export default RunTableRows
