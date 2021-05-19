import { Duration } from 'luxon'

// Given a number of seconds, returns a string representing the duration of a run.
const formatTime = (timeInSeconds) => {
  return Duration.fromMillis(timeInSeconds * 1000).toFormat('h:mm:ss')
}

export default formatTime
