import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Button from '../UI/Button'

const ShoeList = ({ shoes }) => {
  const [isAddingShoes, setIsAddingShoes] = useState(false)

  return (
    <div className=''>
      <div className='grid-cols-shoe-list'>
        <div>Title</div>
        <div>Distance</div>
        <div>Runs</div>

        {shoes &&
          shoes.map((shoe) => {
            ;<>
              <div>{shoe.title}</div>
              <div>{shoe.distance}</div>
              <div>{shoe.runIds.length}</div>
            </>
          })}

        {isAddingShoes ? (
          <>
            <div></div>
            <div></div>
            <div></div>
          </>
        ) : null}
      </div>

      <Button
        type='primary'
        onClick={() => {
          setIsAddingShoes(true)
        }}
      >
        Add shoes
      </Button>
    </div>
  )
}

ShoeList.propTypes = {
  shoes: PropTypes.array,
}

export default ShoeList
