/**
 * Returns the proper English article based on the number provided.
 *
 * @param number - count that comes before the word to articlize.
 * @param a - The singular article in English. Should be "a" or "A".
 * @param an - The plural article in English. Should be "an" or "An".
 * @returns The singular or plural article, `a` or `an`, as provided.
 * @example Used to decide between using "a" or "an" when used with a number.
 * Consider "a 9-mile run" vs "an 11-mile run" or "an 18-mile run", etc.
 */
const articlize = (number: number, a: string, an: string) => {
  if (number === 11 || number === 18 || number.toString().charAt(0) === "8") {
    return an
  } else {
    return a
  }
}

export default articlize
