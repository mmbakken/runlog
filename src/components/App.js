import React, { useState, useEffect } from 'react'
import { APIv1 } from '../api'
import '../styles/App.css'

const App = () => {
  const [message, setMessage] = useState()

  // Test API call to make when app is mounted
  useEffect(() => {
    APIv1.get('/')
    .then((response) => {
      console.log(response.data)
      setMessage(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
  }, [])

  return (
    <div className='App'>
      <header>
        <h1>Runlog</h1>
        <p>Better logging and planning for Fitbit runners</p>
        <p>From the API: {message}</p>
      </header>
    </div>
  )
}

export default App
