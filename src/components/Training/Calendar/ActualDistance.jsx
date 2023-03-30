import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { AllRunsRoute, ViewRunRoute } from '../../../constants/routes'
import { formatActualMileage } from '../../../formatters/formatMileage'

const ActualDistance = ({ isoDate, distance, runIds }) => {
  const history = useHistory()

  const handleClick = (isoDate, runIds) => {
    if (runIds == null || runIds.length === 0) {
      return
    }

    // Go to run's page if only one run today. Otherwise, go to AllRuns page with a filter param.
    let url
    if (runIds.length === 1) {
      url = ViewRunRoute.replace(':runId', runIds[0])
    } else {
      url = `${AllRunsRoute}?date=${isoDate}`
    }

    history.push(url)
  }

  if (distance > 0) {
    return (
      <span
        className='h-6 cursor-pointer hover:text-semibold hover:bg-eggplant-600 transition'
        onClick={() => {
          handleClick(isoDate, runIds)
        }}
      >
        {formatActualMileage(distance)}
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
