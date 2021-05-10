import React from 'react'
import { DateTime, Duration } from 'luxon'

// Contants
import {
  SECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  METERS_PER_MILE,
  METERS_PER_SECOND_TO_MINUTES_PER_MILE,
} from '../../constants/unitConversion.js'

// Given an array of run activities, displays the table content as expected for the ListPage
const RunTableRows = (props) => {
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

  if (props.runs == null || props.runs.length === 0) {
    return null
  } else {
    console.dir(props.runs)
  }

  return props.runs
    .sort((a, b) => {
      return a.startDate < b.startDate ? 1 : -1
    })
    .map((run, index) => {
      return (
        <div key={index} className='table-row contents'>
          <div className={tableCellClasses}>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`https://connect.garmin.com/modern/activity/${run.stravaExternalId.substring(
                12
              )}`}
            >
              {DateTime.fromISO(run.startDate).toLocaleString(
                DateTime.DATE_FULL
              )}
            </a>
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
          <div className={tableCellClasses}>{run.results}</div>
          <div className={tableCellClasses}>{run.shoes}</div>
          <div className={tableCellClasses}>{run.ice ? 'Y' : '-'}</div>
          <div className={tableCellClasses}>{run.stretch ? 'Y' : '-'}</div>
          <div className={tableCellClasses}>
            {run.strength != null ? 'Y' : '-'}
          </div>
        </div>
      )
    })
}

export default RunTableRows
