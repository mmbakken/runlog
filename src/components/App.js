import React, { useEffect, useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import actions from '../reducers/actions'
import { AuthContext } from '../context/AuthContext'
import PrivateRoute from './Auth/PrivateRoute'
import Navbar from './Navbar'
import LoginPage from './Auth/LoginPage'
import HomePage from './HomePage'
import CalendarPage from './Calendar/CalendarPage'
import ListPage from './List/ListPage'
import { APIv1 } from '../api'
import '../styles/App.css'

const App = () => {
  const authDispatch = useContext(AuthContext)[1]

  useEffect(() => {
    // Check for a JWT, and save it to the AuthContext if set
    const token = localStorage.getItem('token')

    if (token != null) {
      // Add the token to the API instance
      APIv1.defaults.headers.post['authorization'] = token
      APIv1.defaults.headers.get['authorization'] = token

      // Go get the user information from the token
      APIv1.get('/user')
      .then((response) => {
        // Then save the user info to auth state
        authDispatch({
          type: actions.SET_USER,
          user: response.data.user
        })
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }, [])

  return (
    <div className='App'>
      <Router>
        <Navbar />

        <Switch>
          <Route path='/login'>
            <LoginPage />
          </Route>

          <PrivateRoute path='/calendar'>
            <CalendarPage />
          </PrivateRoute>

          <PrivateRoute path='/list'>
            <ListPage />
          </PrivateRoute>

          <Route path='/'>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
   )
}

export default App
