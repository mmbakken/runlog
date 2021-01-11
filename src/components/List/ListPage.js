import React, { useState } from 'react'
import { APIv1 } from '../../api'

import '../../styles/ListPage.css'

const ListPage = () => {
  const [runs, setRuns] = useState()

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

  return (
    <div className='ListPage'>
      <header>
        <h1>List Page</h1>
        <p>This page will be for showing a list view of the runs</p>
      </header>

      <div>
        <div style={{
          width: '30rem',
          border: '1px solid black',
          padding: '2rem',
          marginBottom: '4rem',
        }}>
          <pre>{runs && JSON.stringify(runs, null, 2)}</pre>
        </div>

        <button onClick={getRuns}>Get Runs</button>
      </div>
    </div>
  )
}

export default ListPage
