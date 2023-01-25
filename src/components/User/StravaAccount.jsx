import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { APIv1 } from '../../api'

const redirectToStravaAuthPage = (userId) => {
  const stravaClientId = '60410'
  let stravaRedirectURI = encodeURIComponent(
    'https://www.runlog.dev/exchange_token'
  )

  if (userId == null) {
    console.error(
      'userId field is required to link to begin Strava auth process.'
    )
    return
  }

  if (process.env.REACT_APP_ENV === 'dev') {
    stravaRedirectURI = encodeURIComponent(
      'http://localhost:3000/exchange_token'
    )
  }

  // For details, see: https://developers.strava.com/docs/authentication/
  const scopes = encodeURIComponent('read,read_all,activity:read_all')

  window.location.replace(
    `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${stravaRedirectURI}&approval_prompt=force&scope=${scopes}&state=${userId}`
  )
}

// Tell Runlog API to talk to Strava and get the most recent run activities
const getRecentStravaRuns = () => {
  APIv1.get('/strava/runs')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
    })
}

const StravaAccount = ({ hasStravaAccount, userId }) => {
  const [stravaRuns, setStravaRuns] = useState([])

  return (
    <div className='mx-4'>
      <h2 className='text-lg mb-2'>Strava Account</h2>

      {!hasStravaAccount ? (
        <section className='text-base space-y-2'>
          {stravaRuns?.length > 0 ? (
            <div>
              <h2>Recent Runs</h2>
              <pre className='font-mono text-sm w-full sm:w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
                {JSON.stringify(stravaRuns, null, 2)}
              </pre>
            </div>
          ) : null}

          <button
            className='px-4 py-2 text-white border border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition focus:outline-none'
            onClick={() => {
              setStravaRuns(getRecentStravaRuns(userId))
            }}
          >
            {stravaRuns?.length > 0 ? 'Refresh' : 'Get Recent Strava Runs'}
          </button>
        </section>
      ) : (
        <section className='text-base space-y-2'>
          <button
            className='px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition'
            onClick={() => {
              redirectToStravaAuthPage(userId)
            }}
          >
            Link Strava Account
          </button>
        </section>
      )}
    </div>
  )
}

StravaAccount.propTypes = {
  hasStravaAccount: PropTypes.bool,
  userId: PropTypes.string.isRequired,
}

export default StravaAccount
