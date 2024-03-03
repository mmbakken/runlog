import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/toast.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RequireAuth from 'components/Auth/RequireAuth'
import StravaTokenHandler from 'components/Auth/StravaTokenHandler'

import Navbar from 'components/Navbar'
import LoginPage from 'components/Auth/LoginPage'
import HomePage from 'components/HomePage'
import AllTrainingPlans from 'components/Training/AllTrainingPlans'
import ViewTrainingPlan from 'components/Training/ViewTrainingPlan'
import CreateTrainingPlan from 'components/Training/CreateTrainingPlan'
import AllRuns from 'components/Runs/AllRuns'
import ViewRun from 'components/Runs/ViewRun'
import AccountPage from 'components/User/AccountPage'

import {
  HomeRoute,
  ViewTrainingPlanRoute,
  CreateTrainingRoute,
  AllTrainingPlansRoute,
  AllRunsRoute,
  ViewRunRoute,
  LoginRoute,
  AccountRoute,
} from 'app/routes'

const App = () => {
  return (
    <div className='font-sans text-neutral-200 h-full w-full min-w-[350px] max-w-screen-2xl mx-auto'>
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

        <Routes>
          <Route
            path='/exchange_token'
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <StravaTokenHandler />
              </RequireAuth>
            }
          />

          <Route path={LoginRoute} element={<LoginPage />} />

          <Route
            path={CreateTrainingRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <CreateTrainingPlan />
              </RequireAuth>
            }
          />

          <Route
            path={AllTrainingPlansRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <AllTrainingPlans />
              </RequireAuth>
            }
          />

          <Route
            path={ViewTrainingPlanRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <ViewTrainingPlan />
              </RequireAuth>
            }
          />

          <Route
            exact
            path={AllRunsRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <AllRuns />
              </RequireAuth>
            }
          />

          <Route
            path={ViewRunRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <ViewRun />
              </RequireAuth>
            }
          />

          <Route
            path={AccountRoute}
            element={
              <RequireAuth redirectTo={LoginRoute}>
                <AccountPage />
              </RequireAuth>
            }
          />

          <Route path={HomeRoute} element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
