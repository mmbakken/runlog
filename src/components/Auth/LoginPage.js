import React, { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import actions from '../../reducers/actions'
import { AuthContext } from '../../context/AuthContext'
import { APIv1, setAuthHeader } from '../../api'
import { HomeRoute } from '../../constants/routes'

import '../../styles/LoginPage.css'

const LoginPage = () => {
  const authDispatch = useContext(AuthContext)[1]
  const history = useHistory()
  const location = useLocation()

  // Send API call to log the user in with their email and password
  const login = () => {
    const userData = {
      email: document.getElementById('userEmail').value,
      password: document.getElementById('userPassword').value,
    }

    authDispatch({
      type: actions.LOGIN__START,
    })

    APIv1.post('/users/login', userData)
      .then((response) => {
        localStorage.setItem('token', response.data.accessToken)
        setAuthHeader(response.data.accessToken)

        authDispatch({
          type: actions.LOGIN__SUCCESS,
          user: response.data.user,
        })

        // If we were redirected to the login page, send the user where they wanted to go.
        let from = HomeRoute
        if (
          location &&
          location.state &&
          location.state.from &&
          location.state.from.pathname
        ) {
          from = location.state.from.pathname
        }

        history.push(from)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='LoginPage'>
      <h3>Log In</h3>

      <div
        style={{
          width: '30rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            width: '100%',
            marginBottom: '0.5rem',
          }}
        >
          <label
            style={{ display: 'block', marginBottom: '0.25rem' }}
            name='email'
          >
            Email
          </label>
          <input id='userEmail' name='email' type='text' placeholder='Email' />
        </div>

        <div
          style={{
            width: '100%',
            marginBottom: '0.5rem',
          }}
        >
          <label
            style={{ display: 'block', marginBottom: '0.25rem' }}
            name='password'
          >
            Password
          </label>
          <input
            id='userPassword'
            name='password'
            type='password'
            placeholder='Password'
          />
        </div>
      </div>

      <button onClick={login}>Log In</button>
    </div>
  )
}

export default LoginPage
