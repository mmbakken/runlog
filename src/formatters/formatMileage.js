// Contants
import { METERS_PER_MILE } from '../constants/unitConversion.js'

// Given a number of meters, returns a number of the equivalent in miles.
const formatActualMileage = (distanceInMeters) => {
  return Number(distanceInMeters / METERS_PER_MILE)
    .toFixed(2)
    .toLocaleString()
}

const formatPlannedMileage = (distanceInMiles) => {
  if (
    Number.isNaN(distanceInMiles) ||
    distanceInMiles == null ||
    distanceInMiles === 0
  ) {
    distanceInMiles = 0
  }

  return Number(distanceInMiles).toFixed(2).toLocaleString()
}

export { formatActualMileage, formatPlannedMileage }
