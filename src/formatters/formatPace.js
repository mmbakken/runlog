import { Duration } from 'luxon'

// Contants
import {
  SECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  METERS_PER_SECOND_TO_MINUTES_PER_MILE,
} from '../constants/unitConversion.js'

// Convert meters per second into minutes per mile, as a string to display to humans.
const formatPace = (speedInMetersPerSecond) => {
  if (
    speedInMetersPerSecond == null ||
    Number.isNaN(speedInMetersPerSecond) ||
    speedInMetersPerSecond === 0
  ) {
    return '–'
  }

  // Solve for x, given speed:
  //
  // 26.8224 min/mi       x min/mi             26.8224 min/mi
  // --------------- === ----------- => x === ----------------
  //     1 m/s            speed m/s                 speed

  const minutesPerMile =
    METERS_PER_SECOND_TO_MINUTES_PER_MILE / speedInMetersPerSecond
  return (
    Duration.fromMillis(
      minutesPerMile * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
    ).toFormat('m:ss') + '/mi'
  )
}

export default formatPace
