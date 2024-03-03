import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import actions from '../../reducers/actions'
import { AuthContext } from '../../context/AuthContext'
import { APIv1, setAuthHeader } from '../../api'
import { HomeRoute } from 'app/routes'
import Button from '../UI/Button'

const LoginPage = () => {
  const authDispatch = useContext(AuthContext)[1]
  const navigate = useNavigate()
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

        navigate(from)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div className='LoginPage w-full px-4 pb-4'>
      <h1 className='text-2xl mb-4'>Log In</h1>

      <div className='w-full space-y-4'>
        <div className='flex flex-col w-full md:w-1/3 lg:w-1/4 space-y-1'>
          <label name='email'>Email</label>
          <input
            className='px-4 py-2 border rounded border-neutral-500'
            id='userEmail'
            name='email'
            type='text'
            placeholder='Email'
          />
        </div>

        <div className='flex flex-col w-full md:w-1/3 lg:w-1/4 space-y-1'>
          <label name='password'>Password</label>
          <input
            className='px-4 py-2 border rounded border-neutral-500'
            id='userPassword'
            name='password'
            type='password'
            placeholder='Password'
          />
        </div>
      </div>

      <div className='mt-6'>
        <Button type='primary' onClick={login}>
          Log In
        </Button>
      </div>
    </div>
  )
}

export default LoginPage
