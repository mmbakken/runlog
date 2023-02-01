import React from 'react'
import PropTypes from 'prop-types'

import ShoeList from './ShoeList'

const Gear = ({ gear }) => {
  return (
    <div className='pb-4 space-y-4'>
      <header className='mx-4'>
        <h2 className='text-2xl mb-2'>Gear</h2>
        <p>
          Manage your running gear so you can attach them to your runs and track
          their use.
        </p>
      </header>

      <section className='mx-4'>
        <h3 className='text-lg mb-2'>Shoes</h3>
        <pre className='mb-4 font-mono text-sm w-full sm:w-120 max-h-120 min-h-16 border bg-neutral-800 border-neutral-500 rounded overflow-scroll break-words px-2 py-1'>
          {JSON.stringify(gear, null, 2)}
        </pre>

        <ShoeList shoes={gear?.shoes} />
      </section>
    </div>
  )
}

Gear.propTypes = {
  gear: PropTypes.shape({
    shoes: PropTypes.array,
  }),
}

export default Gear
