import React, { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import actions from '../../reducers/actions'
import { AuthContext } from '../../context/AuthContext'
import { APIv1, setAuthHeader } from '../../api'
import { HomeRoute } from '../../constants/routes'

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
    <div className='LoginPage w-full px-4 pb-4'>
      <h1 className='text-xl mb-4'>Log In</h1>

      <div className='w-full space-y-2'>
        <div className='flex flex-col w-full md:w-1/3 lg:w-1/4 space-y-1'>
          <label name='email'>Email</label>
          <input
            className='px-4 py-2 border rounded border-gray-900'
            id='userEmail'
            name='email'
            type='text'
            placeholder='Email'
          />
        </div>

        <div className='flex flex-col w-full md:w-1/3 lg:w-1/4 space-y-1'>
          <label name='password'>Password</label>
          <input
            className='px-4 py-2 border rounded border-gray-900'
            id='userPassword'
            name='password'
            type='password'
            placeholder='Password'
          />
        </div>
      </div>

      <button
        className='mt-4 px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition'
        onClick={login}
      >
        Log In
      </button>
    </div>
  )
}

export default LoginPage
