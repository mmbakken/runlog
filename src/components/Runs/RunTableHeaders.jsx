import React from 'react'

// Simple component for displaying table headers
const RunTableHeaders = () => {
  return (
    <div className='RunTableHeaders contents'>
      <div className='whitespace-nowrap ml-4 pb-1 col-span-2'>Date</div>
      <div className='whitespace-nowrap pr-2 sm:pr-4 pb-1'>Title</div>
      <div className='whitespace-nowrap justify-self-end pl-2 sm:pl-4 pb-1'>
        Miles
      </div>
      <div className='whitespace-nowrap justify-self-end pl-2 sm:pl-4 pb-1'>
        Time
      </div>
      <div className='whitespace-nowrap justify-self-end pl-2 sm:pl-4 pb-1'>
        Pace
      </div>
      <div className='whitespace-nowrap justify-self-end pl-2 sm:pl-4 pb-1'>
        Avg HR
      </div>
      <div className='whitespace-nowrap justify-self-end pl-2 sm:pl-4 pb-1 mr-4'>
        Max HR
      </div>
    </div>
  )
}

export default RunTableHeaders
