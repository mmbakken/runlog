import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

import '../../styles/AccountPage.css'

const AccountPage = () => {
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth
  const hasFitbitAccount = auth.user && auth.user.hasFitbitAuth

  const redirectToFitbitAuthPage = () => {
    const fitbitClientId = '22C6QQ'

    // TODO: Get the localhost version of the redirect working
    const redirectURI = encodeURIComponent('https://www.runlog.dev/callback')
    // const redirectURI = encodeURIComponent('localhost:3000/callback')

    window.location.replace(
      `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${fitbitClientId}&redirect_uri=${redirectURI}&scope=activity%20heartrate%20location%20profile%20settings%20weight&expires_in=604800`
    )
  }

  const redirectToStravaAuthPage = () => {
    const stravaClientId = '60410'
    let stravaRedirectURI = encodeURIComponent(
      'https://www.runlog.dev/exchange_token'
    )

    if (process.env.REACT_APP_ENV === 'dev') {
      stravaRedirectURI = encodeURIComponent(
        'http://localhost:3000/exchange_token'
      )
    }

    // For details, see: https://developers.strava.com/docs/authentication/
    // TODO: When we want to start uploading old Fitbit activities to Strava, we'll need
    // to add the 'activity:write' scope here.
    const scopes = encodeURIComponent('read,read_all,activity:read_all')

    window.location.replace(
      `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${stravaRedirectURI}&approval_prompt=force&scope=${scopes}&state=${auth.user.id}`
    )
  }

  return (
    <div className='AccountPage'>
      <header>
        <h1>Account Settings</h1>
        <p>
          Manage your user account settings and your Fitbit and Strava
          authorization.
        </p>
      </header>

      <div>
        <pre className='font-mono'>{JSON.stringify(auth.user, null, 2)}</pre>
      </div>

      {!hasFitbitAccount && (
        <div>
          <button onClick={redirectToFitbitAuthPage}>
            Link Fitbit Account
          </button>
        </div>
      )}

      {!hasStravaAccount && (
        <div>
          <button onClick={redirectToStravaAuthPage}>
            Link Strava Account
          </button>
        </div>
      )}
    </div>
  )
}

export default AccountPage
