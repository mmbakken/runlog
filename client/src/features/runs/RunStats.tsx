import { DateTime } from "luxon"
import {
  formatActualMileage,
  formatPace,
  formatDuration,
  formatHeartRate,
} from "app/formatters"
import { stravaTimezoneToLuxonTimezone } from "app/utils"

type RunStatsProps = {
  startDate?: string // DateTime string like "2023-03-20T23:07:39.000Z"
  timezone?: string
  startLocation?: string
  distance?: number
  time?: number
  averageSpeed?: number
  hasHeartRate?: boolean
  heartRateAvg?: number
  heartRateMax?: number
}

const RunStats = ({
  startDate,
  timezone,
  startLocation,
  distance = 0,
  time = 0,
  averageSpeed = 0,
  hasHeartRate = false,
  heartRateAvg = 0,
  heartRateMax = 0,
}: RunStatsProps) => {
  const showDate =
    startDate != null && startDate !== "" && timezone != null && timezone !== ""
  const showLocation = startLocation != null && startLocation !== ""
  const hasDistance = distance != null
  const hasTime = time != null
  const hasAverageSpeed = averageSpeed != null

  const showDateAndLocationLine = showLocation || showDate
  const showStatsBox = hasDistance || hasTime || hasAverageSpeed || hasHeartRate

  if (!showDateAndLocationLine && !showStatsBox) {
    return null
  }

  return (
    <>
      {showDateAndLocationLine && (
        <div>
          <p className="flex space-x-1 text-neutral-500">
            {showDate && (
              <span>
                {DateTime.fromISO(startDate, {
                  zone: stravaTimezoneToLuxonTimezone(timezone),
                }).toLocaleString(DateTime.DATETIME_FULL)}
              </span>
            )}

            {showLocation ? (
              <>
                <span>in</span>
                <span>{startLocation}</span>
              </>
            ) : null}
          </p>
        </div>
      )}

      {showStatsBox && (
        <div className="flex w-full items-center justify-between space-x-4 border border-neutral-500 p-4 text-xl sm:w-auto">
          {hasDistance && (
            <div className="flex flex-col items-center">
              <div>{formatActualMileage(distance)}</div>
              <div className="text-base text-neutral-400">miles</div>
            </div>
          )}

          {hasTime && (
            <div className="flex flex-col items-center">
              <div>{formatDuration(time)}</div>
              <div className="text-base text-neutral-400">time</div>
            </div>
          )}

          {hasAverageSpeed && (
            <div className="flex flex-col items-center">
              <div>{formatPace(averageSpeed)}</div>
              <div className="text-base text-neutral-400">pace</div>
            </div>
          )}

          {hasHeartRate && (
            <div className="flex flex-col items-center">
              <div>
                {formatHeartRate(heartRateAvg)} /{" "}
                {formatHeartRate(heartRateMax)}
              </div>
              <div className="text-base text-neutral-400">heart rate</div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RunStats
