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

const RunTableRow = ({ run, showBottomBorder }) => {
  if (run == null) {
    return null
  }

  let tableCellClasses = 'py-1 flex items-center'

  return (
    <div className='RunTableRow table-row contents'>
      <div className={`${tableCellClasses} ml-4 pr-2 sm:pr-4 md:pr-8 lg:pr-12`}>
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
        <Link to={ViewRunRoute.split(':')[0].concat(run._id)}>{run.title}</Link>
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

      {showBottomBorder && (
        <div className='table-row col-span-7 pt-1 mb-1 mx-4 border-b border-eggplant-700' />
      )}
    </div>
  )
}

RunTableRow.propTypes = {
  run: PropTypes.object,
  showBottomBorder: PropTypes.bool,
}

export default RunTableRow
