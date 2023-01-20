import React from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/toast.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './Auth/PrivateRoute'
import StravaTokenHandler from './Auth/StravaTokenHandler'

import Navbar from './Navbar'
import LoginPage from './Auth/LoginPage'
import HomePage from './HomePage'
import AllTrainingPlans from './Training/AllTrainingPlans'
import ViewTrainingPlan from './Training/ViewTrainingPlan'
import CreateTrainingPlan from './Training/CreateTrainingPlan'
import AllRuns from './Runs/AllRuns'
import ViewRun from './Runs/ViewRun'
import AccountPage from './User/AccountPage'

import {
  HomeRoute,
  ViewTrainingPlanRoute,
  CreateTrainingRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
  ViewRunRoute,
  LoginRoute,
  AccountRoute,
} from '../constants/routes'

const App = () => {
  return (
    <div className='font-sans text-gray-900 h-full w-full min-w-[350px] max-w-screen-2xl mx-auto'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />

      <Router>
        <Navbar />

        <Switch>
          <PrivateRoute path='/exchange_token'>
            <StravaTokenHandler />
          </PrivateRoute>

          <Route path={LoginRoute}>
            <LoginPage />
          </Route>

          <PrivateRoute path={CreateTrainingRoute}>
            <CreateTrainingPlan />
          </PrivateRoute>

          <PrivateRoute path={AllTrainingPlansRoute}>
            <AllTrainingPlans />
          </PrivateRoute>

          <PrivateRoute path={ViewTrainingPlanRoute}>
            <ViewTrainingPlan />
          </PrivateRoute>

          <PrivateRoute exact path={AllRunsRoute}>
            <AllRuns />
          </PrivateRoute>

          <PrivateRoute path={ViewRunRoute}>
            <ViewRun />
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
