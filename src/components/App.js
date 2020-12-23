import React, { useState, useEffect } from 'react'
import { APIv1 } from '../api'
import '../styles/App.css'

const App = () => {
  const [message, setMessage] = useState()
  const [token, setToken] = useState()
  const [runs, setRuns] = useState()

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

  // Send API call to log the user in with their email and password
  const login = () => {
    const userData = {
      email: document.getElementById('userEmail').value,
      password: document.getElementById('userPassword').value,
    }

    console.dir(userData)

    APIv1.post('/users/login', userData)
    .then((response) => {
      console.dir(response.data.accessToken)
      setToken(response.data.accessToken)
    })
    .catch((error) => {
      console.error(error)
    })
  }

  // Send API call to log the user in with their email and password
  const getRuns = () => {
    if (token == null) {
      return alert('No token! Log in first')
    }

    APIv1.get('/runs', {
      headers: {
        authorization: token
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
