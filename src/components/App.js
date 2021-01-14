import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './Auth/PrivateRoute'
import Navbar from './Navbar'
import LoginPage from './Auth/LoginPage'
import HomePage from './HomePage'
import CalendarPage from './Calendar/CalendarPage'
import ListPage from './List/ListPage'

import {
  HomeRoute,
  CalendarRoute,
  ListRoute,
  LoginRoute,
} from '../constants/routes'
import '../styles/App.css'

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />

        <Switch>
          <Route path={LoginRoute}>
            <LoginPage />
          </Route>

          <PrivateRoute path={CalendarRoute}>
            <CalendarPage />
          </PrivateRoute>

          <PrivateRoute path={ListRoute}>
            <ListPage />
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
