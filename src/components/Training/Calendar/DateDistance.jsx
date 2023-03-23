import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { AllRunsRoute, ViewRunRoute } from '../../../constants/routes'
import PlannedDistanceInput from './PlannedDistanceInput'
import { formatActualMileage } from '../../../formatters/formatMileage'

const DateDistance = ({
  showPlannedInput,
  isoDate,
  onDateEdit,
  plannedDistance,
  actualDistance,
  runIds,
}) => {
  const history = useHistory()

  const onActualDistanceClick = (isoDate, runIds) => {
    console.log(isoDate)
    console.log(runIds)

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

  return (
    <div className='w-32 px-2 py-1 text-right cursor-default'>
      {showPlannedInput ? (
        <PlannedDistanceInput
          distance={plannedDistance}
          onChange={(value) => onDateEdit('plannedDistance', value, isoDate)}
        />
      ) : (
        <span
          className='h-6 cursor-pointer hover:text-semibold hover:bg-eggplant-600 transition'
          onClick={() => {
            onActualDistanceClick(isoDate, runIds)
          }}
        >
          {formatActualMileage(actualDistance)}
        </span>
      )}
    </div>
  )
}

DateDistance.propTypes = {
  showPlannedInput: PropTypes.bool.isRequired,
  isoDate: PropTypes.string.isRequired,
  onDateEdit: PropTypes.func,
  plannedDistance: PropTypes.number,
  actualDistance: PropTypes.number,
  runIds: PropTypes.array,
}

export default DateDistance
