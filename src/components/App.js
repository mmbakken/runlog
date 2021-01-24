import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './Auth/PrivateRoute'
import Navbar from './Navbar'
import LoginPage from './Auth/LoginPage'
import StravaTokenHandler from './Auth/StravaTokenHandler'
import HomePage from './HomePage'
import CalendarPage from './Calendar/CalendarPage'
import ListPage from './List/ListPage'
import AccountPage from './User/AccountPage'

import {
  HomeRoute,
  CalendarRoute,
  ListRoute,
  LoginRoute,
  AccountRoute,
} from '../constants/routes'
import '../styles/App.css'

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />

        <Switch>
          <PrivateRoute path='/exchange_token'>
            <StravaTokenHandler />
          </PrivateRoute>

          <Route path={LoginRoute}>
            <LoginPage />
          </Route>

          <PrivateRoute path={CalendarRoute}>
            <CalendarPage />
          </PrivateRoute>

          <PrivateRoute path={ListRoute}>
            <ListPage />
          </PrivateRoute>

          <PrivateRoute path={AccountRoute}>
            <AccountPage />
          </PrivateRoute>

          <Route path={HomeRoute}>
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
