import React from 'react'

// Simple component for displaying table headers
const DailyStatsTableHeaders = () => {
  return (
    <div className='DailyStatsTableHeaders contents'>
      <div className={'pr-4 pb-1'}>Date</div>
      <div className={'pr-4 pb-1'}>Title</div>
      <div className={'justify-self-end pl-4 pb-1'}>Miles</div>
      <div className={'justify-self-end pl-4 pb-1'}>Weekly</div>
      <div className={'justify-self-end pl-4 pb-1'}>7-Day</div>
    </div>
  )
}

export default DailyStatsTableHeaders
