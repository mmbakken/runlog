import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { APIv1 } from '../../api'

import StravaImport from './StravaImport'

import '../../styles/ListPage.css'

const ListPage = () => {
  const [runs, setRuns] = useState()
  const [stravaRuns, setStravaRuns] = useState()
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  // Send API call to log the user in with their email and password
  const getRuns = () => {
    APIv1.get('/runs')
      .then((response) => {
        setRuns(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Tell Runlog API to talk to Strava and get the most recent run activities
  const getRecentStravaRuns = () => {
    // Go get the full user information
    APIv1.get('/strava/runs')
      .then((response) => {
        setStravaRuns(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='ListPage'>
      <header>
        <h1>List Page</h1>
        <p>This page will be for showing a list view of the runs</p>
      </header>

      <section>
        <div>
          <h3>Runlog.dev runs</h3>
          <pre>{runs && JSON.stringify(runs, null, 2)}</pre>
        </div>

        <button onClick={getRuns}>Get Runs</button>
      </section>

      {hasStravaAccount && (
        <>
          <section>
            <div>
              <h3>Recent Strava Runs</h3>
              <pre>{stravaRuns && JSON.stringify(stravaRuns, null, 2)}</pre>
            </div>

            <button onClick={getRecentStravaRuns}>Get Strava Runs</button>
          </section>

          <StravaImport />
        </>
      )}
    </div>
  )
}

export default ListPage
