import React, { useState, useEffect, useContext } from 'react'

import { APIv1 } from '../api'

import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'

import '../styles/App.css'

//import HomePage from './HomePage'
import Navbar from './Navbar'
//import UserPage from './User/UserPage'
//import PrivateRoute from './Auth/PrivateRoute'



const App = () => {
  const [message, setMessage] = useState()
  const [runs, setRuns] = useState()
  const [auth, authDispatch] = useContext(AuthContext)

  // Test API call to make when app is mounted
  useEffect(() => {
    APIv1.get('/hello')
    .then((response) => {
      setMessage(response.data)
    })
    .catch((error) => {
      console.error(error)
    })

    // Check for a JWT, and save it to the AuthContext if set
    const token = localStorage.getItem('token')
    if (token != null) {
      authDispatch({
        type: actions.SET_TOKEN,
        token: token,
      })
    }
  }, [])

  // Send API call to log the user in with their email and password
  const login = () => {
    const userData = {
      email: document.getElementById('userEmail').value,
      password: document.getElementById('userPassword').value,
    }

    console.dir(userData)

    authDispatch({
      type: actions.LOGIN__START
    })

    APIv1.post('/users/login', userData)
    .then((response) => {
      console.dir(response.data.accessToken)
      localStorage.setItem('token', response.data.accessToken)

      authDispatch({
        type: actions.LOGIN__SUCCESS,
        token: response.data.accessToken,
        user: response.data.user,
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  // Delete the user token and reset auth state
  const logout = () => {
    localStorage.setItem('token', null)
    authDispatch({
      type: actions.LOGOUT
    })
  }

  // Send API call to log the user in with their email and password
  const getRuns = () => {
    console.log('auth:')
    console.dir(auth)

    // TODO: Read the login state from the authContext first!
    // If logged in and a token exists, then we make the API call
    // If not, redirect to the login page (for now, just send an alert)
    if (auth.token == null) {
      return alert('No token! Log in first')
    }

    APIv1.get('/runs', {
      headers: {
        authorization: auth.token
      }
    })
    .then((response) => {
      setRuns(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  return (
    <div className='App'>
      <Navbar />

      <header>
        <h1>Runlog</h1>
        <p>Better logging and planning for Fitbit runners</p>
        <p>From the API: {message}</p>
      </header>

      <div>
        <h3>Log In</h3>

        <div style={{
          width: '30rem',
          marginBottom: '1rem',
        }}>
          <div style={{
            width: '100%',
            marginBottom: '0.5rem',
          }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }} name='email'>
              Email
            </label>
            <input id='userEmail' name='email' type='text' placeholder='Email' />
          </div>

          <div style={{
            width: '100%',
            marginBottom: '0.5rem',
          }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }} name='password'>
              Password
            </label>
            <input id='userPassword' name='password' type='password' placeholder='Password' />
          </div>
         </div>

        <button onClick={login}>Log In</button>
      </div>

      <div>
        <h3>Logout</h3>
        <button onClick={logout}>Log Out</button>
      </div>

      <div>
        <h3>Runs</h3>
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

export default App
