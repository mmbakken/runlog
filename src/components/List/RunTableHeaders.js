import React from 'react'

// Simple component for displaying table headers
const RunTableHeaders = () => {
  return (
    <div className='RunTableHeaders contents'>
      <div className={'pr-4 pb-1'}>Date</div>
      <div className={'pr-4 pb-1'}>Title</div>
      <div className={'justify-self-end pl-4 pb-1'}>Miles</div>
      <div className={'justify-self-end pl-4 pb-1'}>Time</div>
      <div className={'justify-self-end pl-4 pb-1'}>Pace</div>
      <div className={'justify-self-end pl-4 pb-1'}>Avg HR</div>
      <div className={'justify-self-end pl-4 pb-1'}>Max HR</div>
    </div>
  )
}

export default RunTableHeaders
