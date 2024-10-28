import { useState } from 'react'
import PropTypes from 'prop-types'
import { APIv1 } from '../../api'

import Button from '../UI/Button'
import stravaConnectWithButton from 'app/assets/stravaConnectWithButton.svg'

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

  if (import.meta.env.DEV) {
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
const getRecentStravaRuns = (setStravaRuns) => {
  APIv1.get('/strava/runs')
    .then((response) => {
      setStravaRuns(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
}

const StravaAccount = ({ hasStravaAccount, userId }) => {
  const [stravaRuns, setStravaRuns] = useState([])

  return (
    <div className='mx-4'>
      <h2 className='mb-2 text-lg'>Strava Account</h2>

      {hasStravaAccount ? (
        <section className='space-y-2 text-base'>
          {stravaRuns?.length > 0 ? (
            <div>
              <h2>Recent Runs</h2>
              <pre className='max-h-120 min-h-16 w-full overflow-scroll break-words rounded border border-neutral-500 bg-neutral-800 px-2 py-1 font-mono text-sm sm:w-120'>
                {JSON.stringify(stravaRuns, null, 2)}
              </pre>
            </div>
          ) : null}

          <Button
            type='primary'
            onClick={() => {
              getRecentStravaRuns(setStravaRuns)
            }}
          >
            {stravaRuns?.length > 0 ? 'Refresh' : 'Get Recent Strava Runs'}
          </Button>
        </section>
      ) : (
        <section className='space-y-2 text-base'>
          <button
            className=''
            onClick={() => {
              redirectToStravaAuthPage(userId)
            }}
          >
            <img alt='Connect with Strava' src={stravaConnectWithButton} />
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
