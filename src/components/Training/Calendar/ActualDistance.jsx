import React from 'react'
import PropTypes from 'prop-types'
import { AllRunsRoute, ViewRunRoute } from '../../../constants/routes'
import { formatActualMileage } from '../../../formatters/formatMileage'

const ActualDistance = ({ isoDate, distance, runIds }) => {
  // Go to run's page if only one run today. Otherwise, go to AllRuns page with a filter param.
  const url = new URL(window.location)
  let route = ViewRunRoute.replace(':runId', runIds[0])
  if (runIds.length > 1) {
    route = `${AllRunsRoute}?date=${isoDate}`
  }

  if (distance > 0) {
    return (
      <span className='h-6 cursor-pointer hover:text-semibold hover:bg-eggplant-600 transition'>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href={`${url.origin}${route}`}
        >
          {formatActualMileage(distance)}
        </a>
      </span>
    )
  } else {
    return <span className='h-6'>{formatActualMileage(distance)}</span>
  }
}

ActualDistance.propTypes = {
  isoDate: PropTypes.string.isRequired,
  distance: PropTypes.number,
  runIds: PropTypes.array,
}

export default ActualDistance
