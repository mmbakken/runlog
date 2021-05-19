// Contants
import { METERS_PER_MILE } from '../constants/unitConversion.js'

// Given a number of meters, returns a number of the equivalent in miles.
const formatMileage = (distanceInMeters) => {
  return Number(distanceInMeters / METERS_PER_MILE)
    .toFixed(2)
    .toLocaleString()
}

export default formatMileage
