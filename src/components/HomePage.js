import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'
import { APIv1 } from '../api'
import { HomeRoute } from '../constants/routes'

import '../styles/HomePage.css'

const HomePage = () => {
  const [message, setMessage] = useState()
  const [auth, authDispatch] = useContext(AuthContext)
  const history = useHistory()

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

  // Delete the user token and reset auth state
  const logout = () => {
    localStorage.removeItem('token')
    authDispatch({
      type: actions.LOGOUT,
    })
    history.push(HomeRoute)
  }

  return (
    <div className='HomePage'>
      <header>
        <h1>Runlog</h1>
        <p>Better logging and planning for Fitbit runners</p>
        <p>From the API: {message}</p>
      </header>

      <div>
        <pre>{JSON.stringify(auth, null, 2)}</pre>
      </div>

      {auth.isLoggedIn && (
        <div>
          <h3>Logout</h3>
          <button onClick={logout}>Log Out</button>
        </div>
      )}
    </div>
  )
}

export default HomePage
