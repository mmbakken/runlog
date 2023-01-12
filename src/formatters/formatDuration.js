import { Duration } from 'luxon'

// Given a number of seconds, returns a string representing the duration of a run.
const formatDuration = (timeInSeconds) => {
  const duration = Duration.fromMillis(timeInSeconds * 1000)

  if (duration.as('hours') >= 1) {
    return duration.toFormat('h:mm:ss')
  } else {
    return duration.toFormat('mm:ss')
  }
}

export default formatDuration
