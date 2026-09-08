/**
 * Converts Strava's timezone string to a Luxon-compatible string.
 * See: https://moment.github.io/luxon/docs/manual/zones.html#creating-datetimes-in-a-zone
 *
 * @param {string} stravaTimezone - The timezone string from the Strava
 * activity.
 * @returns {string} A luxon timezone string.
 * @example "(GMT-06:00) America/Chicago" => "America/Chicago".
 */
const stravaTimezoneToLuxonTimezone = (stravaTimezone: string) => {
  return stravaTimezone.split(' ')[1]
}

export default stravaTimezoneToLuxonTimezone
