// Given a heart rate, returns a string to display to the user.
const formatHeartRate = (heartRate: number) => {
  if (heartRate == null || Number.isNaN(heartRate) || heartRate === 0) {
    return "–"
  }

  return Math.round(heartRate)
}

export default formatHeartRate
