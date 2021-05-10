import React from 'react'

// Simple component for displaying table headers
const RunTableHeaders = () => {
  // Tailwind classes
  const tableHeaderClasses = 'px-1 pb-1 first:px-0 text-lg'

  return (
    <div className='contents'>
      <div className={tableHeaderClasses}>Date</div>
      <div className={tableHeaderClasses}>Miles</div>
      <div className={tableHeaderClasses}>Weekly</div>
      <div className={tableHeaderClasses}>7 Day</div>
      <div className={tableHeaderClasses}>Time</div>
      <div className={tableHeaderClasses}>Pace</div>
      <div className={tableHeaderClasses}>Avg HR</div>
      <div className={tableHeaderClasses}>Max HR</div>
      <div className={tableHeaderClasses}>Results</div>
      <div className={tableHeaderClasses}>Shoes</div>
      <div className={tableHeaderClasses}>Ice</div>
      <div className={tableHeaderClasses}>Stretch</div>
      <div className={tableHeaderClasses}>Lift</div>
    </div>
  )
}

export default RunTableHeaders
