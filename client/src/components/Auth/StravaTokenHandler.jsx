import { useContext, useEffect } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { AccountRoute } from 'app/routes'

const StravaTokenHandler = () => {
  const authDispatch = useContext(AuthContext)[1]
  // Example query string:
  // exchange_token?state=&code=a2cc22fecae427b4e1cfc39cbb4e41d1977a5e12&scope=read
  const query = new URLSearchParams(useLocation().search)

  // Send the user's Strava access code to the backend so we can exchange it for a token
  // pair and start making requests to Strava's API.
  const code = query.get('code')
  const scope = query.get('scope')
  const userId = query.get('state')

  if (
    code == null ||
    code === '' ||
    scope == null ||
    scope === '' ||
    userId == null ||
    userId === ''
  ) {
    console.error(
      'Something went wrong while parsing the Strava code after redirect'
    )
    return null
  }

  useEffect(() => {
    APIv1.post(`/users/${userId}/stravaCode/${code}`, { scope: scope })
      .then(() => {
        // Get the updated user object now
        authDispatch({
          type: actions.GET_USER__START,
        })

        // Go get the full user information
        APIv1.get(`/users/${userId}`)
          .then((response) => {
            // Then save the user info to auth state
            authDispatch({
              type: actions.GET_USER__SUCCESS,
              user: response.data,
            })
          })
          .catch((error) => {
            console.error(error)
            authDispatch({
              type: actions.GET_USER__ERROR,
            })
          })
      })
      .catch((error) => {
        console.log(
          'Something went wrong while trying to POST the Strava access code to the Runlog API.'
        )
        console.error(error)
      })
  }, [])

  return (
    <Navigate
      to={{
        pathname: AccountRoute,
      }}
    />
  )
}

export default StravaTokenHandler
