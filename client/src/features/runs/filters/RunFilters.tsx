import { DateTime } from "luxon"
import { useAppDispatch, useAppSelector } from "app/store"
import {
  getStartDate,
  getEndDate,
  getDistanceType,
  getDistance,
  getDistanceMax,
  selectedStartDate,
  selectedEndDate,
  selectedDistanceType,
  selectedDistance,
  selectedDistanceMax,
  clickedResetFilters,
  DISTANCE_MIN_INIT,
  DISTANCE_MAX_INIT,
} from "app/features/runs/filters/runFiltersSlice"
import Button from "app/ui/Button"
import { DistanceTypes } from "app/types"

const RunFilters = () => {
  const dispatch = useAppDispatch()
  const todayISODate = DateTime.local().toISODate()

  //=====================================
  // Redux State
  //=====================================

  const startDate = useAppSelector(getStartDate)
  const endDate = useAppSelector(getEndDate)
  const distanceType = useAppSelector(getDistanceType)
  const distanceMin = useAppSelector(getDistance)
  const distanceMax = useAppSelector(getDistanceMax)

  //===================================
  // Derived state
  //===================================

  // Only allow user to set an endDate filter if a startDate is set.
  const showEndDate = startDate !== ""

  // Ensure maxDistance is never less than minDistance.
  const minMaxDistanceValue =
    distanceMin == null ? DISTANCE_MIN_INIT : distanceMin

  // Ensure minDistance is never more than maxDistance.
  const maxMinDistanceValue =
    distanceMax == null ? DISTANCE_MAX_INIT : distanceMax

  //===================================
  // Event handlers
  //===================================

  /**
   * Event handler for when the start date filter is changed.
   * @param newDate - An ISO 8601 date string like yyyy-mm-dd, or empty string.
   */
  const onStartDateChange = (newDate: string) => {
    dispatch(selectedStartDate(newDate))
  }

  /**
   * Event handler for when the end date filter is changed.
   * @param newDate - An ISO 8601 date string like yyyy-mm-dd, or empty string.
   */
  const onEndDateChange = (newDate: string) => {
    dispatch(selectedEndDate(newDate))
  }

  const onDistanceChange = (value: string) => {
    dispatch(selectedDistance(Number(value)))
  }

  const onDistanceMaxChange = (value: string) => {
    dispatch(selectedDistanceMax(Number(value)))
  }

  const onDistanceTypeChange = (newType: DistanceTypes) => {
    dispatch(selectedDistanceType(newType))
  }

  const onResetButtonClick = () => {
    dispatch(clickedResetFilters())
  }

  return (
    <div className="mb-2 flex w-full flex-col space-y-4 pb-2 md:mb-4 md:flex-row">
      <div className="flex w-full flex-col items-center md:w-auto md:flex-row">
        <div className="flex w-full md:mt-0 md:w-auto">
          <label className="mx-4 text-sm md:text-base">
            Start Date
            <input
              type="date"
              max={todayISODate}
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="mt-1 block h-10 w-36 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm md:mt-2"
            />
          </label>

          {showEndDate && (
            <label className="mr-4 text-sm md:text-base">
              End Date
              <input
                type="date"
                value={endDate}
                min={startDate}
                max={todayISODate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="mt-1 block w-36 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm md:mt-2"
              />
            </label>
          )}
        </div>

        <div className="mt-2 flex w-full md:mt-0 md:w-auto">
          <label className="mx-4 text-sm md:mx-0 md:text-base">
            Distance
            <div className="mt-1 flex items-center md:mt-2">
              <select
                className="mr-4 block h-10 w-28 cursor-pointer rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-sm"
                value={distanceType}
                onChange={(e) =>
                  onDistanceTypeChange(e.target.value as DistanceTypes)
                }
              >
                <option>Between</option>
                <option>Less Than</option>
                <option>More Than</option>
              </select>

              <input
                type="number"
                min="0"
                max={maxMinDistanceValue}
                value={distanceMin}
                onChange={(e) => onDistanceChange(e.target.value)}
                className="mr-2 block h-10 w-10 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-center text-sm"
              />

              {distanceType !== "Between" && <span className="">miles</span>}

              {distanceType === "Between" && (
                <>
                  <span>and</span>
                  <input
                    type="number"
                    min={minMaxDistanceValue}
                    max="100"
                    value={distanceMax}
                    onChange={(e) => onDistanceMaxChange(e.target.value)}
                    className="mx-2 block h-10 w-10 rounded border border-neutral-200 bg-neutral-800 px-2 py-2 text-center text-sm"
                  />
                  <span className="">miles</span>
                </>
              )}
            </div>
          </label>
        </div>

        <div className="mx-4 mt-4 self-start md:mt-8 md:self-center">
          <Button onClick={onResetButtonClick} type="inline">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RunFilters
