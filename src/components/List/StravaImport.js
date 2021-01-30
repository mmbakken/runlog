import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { APIv1 } from '../../api'

//import '../../styles/ListPage.css'

const StravaImport = () => {
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  if (!hasStravaAccount) {
    return null
  }

  // Tell Runlog API to talk to Strava and get the most recent run activities
  const beginStravaBulkImport = () => {
    // Go get the full user information
    APIv1.get('/strava/bulkImport')
      .then((response) => {
        // TODO: Get the updated user record here. The status of the import job is
        // attached to the user record. Might want to just make a separate API route
        // for this info?
        console.dir(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <section className='StravaImport'>
      <header>
        <h3>Runlog.dev runs</h3>
        <p>
          Begin the process of loading of ALL Strava run activities into Runlog.
          This is an asynchronous action and may require a long time to finish.
        </p>
      </header>

      <button onClick={beginStravaBulkImport}>Begin Strava Import</button>
    </section>
  )
}

export default StravaImport
