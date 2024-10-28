import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

import Shoes from './Shoes'
import StravaAccount from './StravaAccount'

const AccountPage = () => {
  const auth = useContext(AuthContext)[0]
  const hasStravaAccount = auth.user && auth.user.hasStravaAuth

  return (
    <div className='AccountPage space-y-8 pb-4'>
      <header className='mx-4'>
        <h1 className='mb-2 text-2xl'>Account Settings</h1>
        <p>View your user settings and manage your Strava authorization.</p>
      </header>

      <Shoes />

      <StravaAccount
        userId={auth?.user?._id}
        hasStravaAccount={hasStravaAccount}
      />

      <div className='mx-4'>
        <h2 className='mb-4 text-lg'>Runlog Account</h2>
        <pre className='max-h-120 min-h-16 w-full overflow-scroll break-words rounded border border-neutral-500 bg-neutral-800 px-2 py-1 font-mono text-sm sm:w-120'>
          {JSON.stringify(auth.user, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default AccountPage
