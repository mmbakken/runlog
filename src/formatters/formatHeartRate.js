// Given a number of seconds, returns a string representing the duration of a run.
const formatHeartRate = (heartRate) => {
  if (heartRate == null || Number.isNaN(heartRate) || heartRate === 0) {
    return '–'
  }

  return Math.round(heartRate)
}

export default formatHeartRate
