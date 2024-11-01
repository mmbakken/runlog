const formatPlannedMileage = (distanceInMiles: number) => {
  if (
    Number.isNaN(distanceInMiles) ||
    distanceInMiles == null ||
    distanceInMiles === 0
  ) {
    distanceInMiles = 0
  }

  return Number(distanceInMiles).toFixed(2).toLocaleString()
}

export default formatPlannedMileage
