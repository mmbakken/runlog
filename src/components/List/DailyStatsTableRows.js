import React from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'

import { RunPageRoute } from '../../constants/routes'

// Unit formatting helper functions
import formatMileage from '../../formatters/formatMileage'
import showWeekDivider from '../../utils/showWeekDivider'

// Given an array of run activities, displays the table content as expected for the ListPage
const DailyStatsTableRows = ({ dailyStats, isLoading }) => {
  if (dailyStats == null || Object.keys(dailyStats).length === 0) {
    return null
  }

  if (isLoading) {
    return <div className='w-full'>Loading...</div>
  }

  // Tailwind classes
  const tableCellClasses = 'py-1 flex items-center'

  const sortedDailyStats = Object.values(dailyStats).sort((a, b) => {
    return a.date < b.date ? 1 : -1
  })

  return sortedDailyStats.map((dailyStats, rowIndex, dailyStatsArray) => {
    const date = DateTime.fromISO(dailyStats.date, { zone: 'utc' })
    const hasMultipleRuns = dailyStats.runIds.length > 1

    let addWeekBorder = false

    if (dailyStatsArray[rowIndex + 1]) {
      let nextDate = DateTime.fromISO(dailyStatsArray[rowIndex + 1].date, {
        zone: 'utc',
      })

      addWeekBorder = showWeekDivider(date, nextDate)
    }

    return (
      <>
        <div key={rowIndex} className='DailyStatsTableRows table-row contents'>
          <div className={`${tableCellClasses} pr-4 md:pr-8 lg:pr-12`}>
            {date.toLocaleString({
              weekday: 'long',
              month: 'numeric',
              day: 'numeric',
              year: '2-digit',
            })}
          </div>

          {hasMultipleRuns && (
            <div
              className={`${tableCellClasses} pr-4 md:pr-8 lg:pr-12 hover:underline cursor-pointer`}
              onClick={() => {
                console.log('TODO: Show/hide runs for this date')
              }}
            >
              {dailyStats.title}
            </div>
          )}

          {!hasMultipleRuns && (
            <div
              className={`${tableCellClasses} pr-4 md:pr-8 lg:pr-12 hover:underline`}
            >
              <Link
                to={RunPageRoute.split(':')[0].concat(dailyStats.runIds[0])}
              >
                {dailyStats.title}
              </Link>
            </div>
          )}

          <div
            className={`${tableCellClasses} justify-self-end pl-4 md:pl-8 lg:pl-12`}
          >
            {formatMileage(dailyStats.distance)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-4 md:pl-8 lg:pl-12`}
          >
            {formatMileage(dailyStats.weeklyDistance)}
          </div>
          <div
            className={`${tableCellClasses} justify-self-end pl-4 md:pl-8 lg:pl-12`}
          >
            {formatMileage(dailyStats.sevenDayDistance)}
          </div>
        </div>

        {addWeekBorder && (
          <div
            key={`${rowIndex}-week-border`}
            className='DailyStatsTableRows table-row col-span-5 w-full border-b border-eggplant-700'
          />
        )}
      </>
    )
  })
}

DailyStatsTableRows.propTypes = {
  runs: PropTypes.object,
  isLoading: PropTypes.bool,
}

export default DailyStatsTableRows
