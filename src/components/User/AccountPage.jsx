import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import StravaAccount from './StravaAccount'

const AccountPage = () => {
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  return (
    <div className='AccountPage pb-4 space-y-4'>
      <header className='mx-4'>
        <h1 className='text-xl'>Account Settings</h1>
        <p>
          View your user settings and manage your Fitbit and Strava
          authorization.
        </p>
      </header>

      <div className='mx-4'>
        <h2 className='text-lg mb-2'>Runlog Account</h2>
        <pre className='font-mono text-sm w-full sm:w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
          {JSON.stringify(auth.user, null, 2)}
        </pre>
      </div>

      <StravaAccount
        userId={auth?.user?.id}
        hasStravaAccount={hasStravaAccount}
      />
    </div>
  )
}

export default AccountPage
