import React from 'react'

// Simple component for displaying table headers
const RunTableHeaders = () => {
  return (
    <div className='RunTableHeaders hidden sm:contents'>
      <div className='col-span-2 ml-4 pb-1 whitespace-nowrap'>Date</div>
      <div className='pr-2 pb-1 whitespace-nowrap sm:pr-4'>Title</div>
      <div className='justify-self-end pb-1 pl-2 whitespace-nowrap sm:pl-4'>
        Miles
      </div>
      <div className='justify-self-end pb-1 pl-2 whitespace-nowrap sm:pl-4'>
        Time
      </div>
      <div className='justify-self-end pb-1 pl-2 whitespace-nowrap sm:pl-4'>
        Pace
      </div>
      <div className='justify-self-end pb-1 pl-2 whitespace-nowrap sm:pl-4'>
        Avg HR
      </div>
      <div className='mr-4 justify-self-end pb-1 pl-2 whitespace-nowrap sm:pl-4'>
        Max HR
      </div>
    </div>
  )
}

export default RunTableHeaders
