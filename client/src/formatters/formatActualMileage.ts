import { METERS_PER_MILE } from "app/constants/unitConversion"

// Given a number of meters, returns a number of the equivalent in miles.
const formatActualMileage = (distanceInMeters: number) => {
  return Number(distanceInMeters / METERS_PER_MILE)
    .toFixed(2)
    .toLocaleString()
}

export default formatActualMileage
