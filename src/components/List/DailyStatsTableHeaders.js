import React from 'react'

// Simple component for displaying table headers
const DailyStatsTableHeaders = () => {
  // Tailwind classes
  const tableHeaderClasses = 'px-1 pb-1 first:px-0'

  return (
    <div className='DailyStatsTableHeaders contents'>
      <div className={tableHeaderClasses}>Date</div>
      <div className={tableHeaderClasses}>Title</div>
      <div className={tableHeaderClasses}>Miles</div>
      <div className={tableHeaderClasses}>Weekly</div>
      <div className={tableHeaderClasses}>7-Day</div>
    </div>
  )
}

export default DailyStatsTableHeaders
