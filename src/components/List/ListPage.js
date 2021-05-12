import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { APIv1 } from '../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

// Components
import StravaImport from './StravaImport'
import RunTableHeaders from './RunTableHeaders'
import RunTableRows from './RunTableRows'

const ListPage = () => {
  const [runs, setRuns] = useState()
  const [stravaRuns, setStravaRuns] = useState()
  const [showDialog, setShowDialog] = useState(false)
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  // When this component is loaded, go get the user's Runlog runs (all of them at once)
  useEffect(() => {
    getRuns()
  }, [])

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
    <div className='ListPage w-full px-4 pb-4 space-y-4'>
      {showDialog && (
        <div className='h-full w-full absolute flex flex-col items-center'>
          <div className='relative w-120 mt-4 py-4 px-8 flex flex-col items-center bg-offwhite-50 border border-gray-900 rounded'>
            <h1 className='text-xl font-semibold text-center'>Run results</h1>

            <FontAwesomeIcon
              className='absolute top-1 right-1.5 cursor-pointer text-xl text-gray-700'
              icon={faTimes}
              onClick={() => {
                setShowDialog(false)
              }}
            />

            <textarea
              className='block w-full h-60 mt-4 overflow-scroll p-2 border border-gray-700 rounded focus:outline-none'
              autoFocus
              placeholder='Where did you run? Feeling fresh, or tired? Any injuries? How was the weather? See any cool animals?'
            />

            <button
              className='mt-4 px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition focus:outline-none'
              onClick={() => {
                console.log('TODO: Actually save the results text')
                setShowDialog(false)
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <section className='grid grid-cols-list-page'>
        <RunTableHeaders />
        <RunTableRows runs={runs} showDialog={() => setShowDialog(true)} />
      </section>

      {hasStravaAccount && (
        <>
          <section className='space-y-2'>
            <div>
              <h2 className='text-lg'>Recent Strava Runs</h2>

              {stravaRuns && stravaRuns.length > 0 && (
                <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
                  {stravaRuns && JSON.stringify(stravaRuns, null, 2)}
                </pre>
              )}
            </div>

            <button
              className='px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition focus:outline-none'
              onClick={getRecentStravaRuns}
            >
              Get Strava Runs
            </button>
          </section>

          <StravaImport />
        </>
      )}
    </div>
  )
}

export default ListPage
