/**
 * Adds two numbers together. Considers up to two decimal places of precision.
 *
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of the two inputs. Has at most two decimal places.
 */
const addFloats = (a: number, b: number) => {
  if (
    a == null ||
    Number.isNaN(a) ||
    typeof a !== 'number' ||
    b == null ||
    Number.isNaN(b) ||
    typeof b !== 'number'
  ) {
    return NaN
  }

  return Math.round((a + b + Number.EPSILON) * 100) / 100
}

export default addFloats
