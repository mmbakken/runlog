import React from 'react'
import PropTypes from 'prop-types'

import ShoeList from './ShoeList'

const Gear = ({ gear }) => {
  return (
    <div className='space-y-4'>
      <header className='mx-4 mb-4'>
        <h2 className='text-xl mb-2'>Gear</h2>
        <p>
          Add running gear, like shoes, so you can link them to your workouts
          and track their mileage.
        </p>
      </header>

      <section className='mx-4'>
        <h3 className='text-lg mb-2'>Shoes</h3>
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
