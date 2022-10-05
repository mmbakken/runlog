// Helper function. Returns the proper English article based on the number provided.
const articlize = (number, a, an) => {
  if (number === 11 || number.toString().charAt(0) === '8') {
    return an
  } else {
    return a
  }
}

export default articlize
