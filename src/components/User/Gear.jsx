import React from 'react'
import PropTypes from 'prop-types'

import ShoeList from './ShoeList'

const Gear = ({ gear }) => {
  return (
    <div className='space-y-4'>
      <section className='mx-4'>
        <h2 className='text-lg mb-2'>Shoes</h2>
        <p className='mb-4'>Add new shoes here and track their mileage.</p>
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
