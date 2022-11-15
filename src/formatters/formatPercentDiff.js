// Given a number of meters, returns a number of the equivalent in miles.
const formatPercentDiff = (diffString) => {
  const number = Number(diffString)

  if (Number.isNaN(number)) {
    return diffString + '%'
  }

  if (number > 1000) {
    return '1,000+%'
  }

  return `${Number(diffString).toFixed(2).toLocaleString()}%`
}

export default formatPercentDiff
