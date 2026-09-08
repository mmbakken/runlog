import { useAppSelector } from 'app/store'
import { useGetRunsQuery } from 'app/features/api/apiSlice'
import RunTableHeaders from './RunTableHeaders'
import RunTableBody from './RunTableBody'

import {
  getStartDate,
  getEndDate,
  getDistanceType,
  getDistance,
  getDistanceMax,
} from 'app/features/runs/filters/runFiltersSlice'

const RunsList = () => {
  //=====================================
  // Redux State
  //=====================================

  const startDate = useAppSelector(getStartDate)
  const endDate = useAppSelector(getEndDate)
  const distanceType = useAppSelector(getDistanceType)
  const distance = useAppSelector(getDistance)
  const distanceMax = useAppSelector(getDistanceMax)

  //=====================================
  // API State
  //=====================================

  const {
    data: runsById,
    isLoading,
    // isSuccess,
    isError,
    error,
  } = useGetRunsQuery({
    startDate: startDate,
    endDate: endDate,
    distanceType: distanceType,
    distance: distance,
    distanceMax: distanceMax,
  })

  if (runsById == null) {
    return null
  }

  return (
    <section className='overflow-scroll sm:grid sm:grid-cols-runs-page sm:space-y-0'>
      <RunTableHeaders />
      <RunTableBody
        runsById={runsById}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </section>
  )
}

export default RunsList
