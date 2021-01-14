import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { APIv1 } from '../api'
import '../styles/HomePage.css'

const HomePage = () => {
  const [message, setMessage] = useState()
  const auth = useContext(AuthContext)[0]

  // Test API call to make when app is mounted
  useEffect(() => {
    APIv1.get('/hello')
      .then((response) => {
        setMessage(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div className='HomePage'>
      <header>
        <h1>Runlog</h1>
        <p>Better logging and planning for Fitbit runners</p>
        <p>From the API: {message}</p>
      </header>

      <div>
        <h3>Auth state</h3>
        <pre>{JSON.stringify(auth, null, 2)}</pre>
      </div>
    </div>
  )
}

export default HomePage
