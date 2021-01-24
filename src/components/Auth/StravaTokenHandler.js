import React, { useEffect } from 'react'
import { useLocation, Redirect } from 'react-router-dom'
import { APIv1 } from '../../api'

import { AccountRoute } from '../../constants/routes'

const StravaTokenHandler = () => {
  // Example query string:
  // exchange_token?state=&code=a2cc22fecae427b4e1cfc39cbb4e41d1977a5e12&scope=read
  const query = new URLSearchParams(useLocation().search)

  // Send the user's Strava access code to the backend so we can exchange it for a token
  // pair and start making requests to Strava's API.
  const code = query.get('code')
  const scope = query.get('scope')
  const userId = query.get('state')

  useEffect(() => {
    APIv1.post(`/users/${userId}/stravaCode/${code}`, { scope: scope })
      .then((response) => {
        console.log('Strava account linked')
        console.dir(response.data)

        // TODO: response.data should be the updated user object
      })
      .catch((error) => {
        console.log(
          'Something went wrong while trying to POST the Strava access code to the Runlog API.'
        )
        console.error(error)
      })
  }, [])

  return (
    <Redirect
      to={{
        pathname: AccountRoute,
      }}
    />
  )
}

export default StravaTokenHandler
