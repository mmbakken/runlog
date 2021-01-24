import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

import '../../styles/AccountPage.css'

const AccountPage = () => {
  const auth = useContext(AuthContext)[0]

  const redirectToFitbitAuthPage = () => {
    const fitbitClientId = '22C6QQ'

    // TODO: Should this be localhost in a dev environment?
    const redirectURI = 'https%3A%2F%2Fwww.runlog.dev%2Fcallback'
    // const redirectURI = 'http%3A%2F%2Flocalhost%3A3000%2Fcallback'

    window.location.replace(
      `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${fitbitClientId}&redirect_uri=${redirectURI}&scope=activity%20heartrate%20location%20profile%20settings%20weight&expires_in=604800`
    )
  }

  const redirectToStravaAuthPage = () => {
    const stravaClientId = '60410'
    let stravaRedirectURI = 'https%3A%2F%2Fwww.runlog.dev%2Fexchange_token'

    if (process.env.REACT_APP_ENV === 'dev') {
      stravaRedirectURI = 'http%3A%2F%2Flocalhost%3A3000%2Fexchange_token'
    }

    window.location.replace(
      `http://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${stravaRedirectURI}&approval_prompt=force&scope=read&state=${auth.user.id}`
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
        <pre>{JSON.stringify(auth.user, null, 2)}</pre>
      </div>

      <div>
        <button onClick={redirectToFitbitAuthPage}>Link Fitbit Account</button>
      </div>

      <div>
        <button onClick={redirectToStravaAuthPage}>Link Strava Account</button>
      </div>
    </div>
  )
}

export default AccountPage
