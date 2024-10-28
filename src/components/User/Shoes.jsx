import { useContext, useEffect } from 'react'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import ShoeList from './ShoeList'

const Shoes = () => {
  const [state, dispatch] = useContext(StateContext)

  // When this component is loaded, go get the user's shoes.
  useEffect(() => {
    if (!dispatch) return

    dispatch({
      type: actions.GET_ALL_SHOES__START,
    })

    APIv1.get('/shoes')
      .then((response) => {
        dispatch({
          type: actions.GET_ALL_SHOES__SUCCESS,
          shoes: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_ALL_SHOES__ERROR,
          error: error,
        })
      })
  }, [dispatch])

  return (
    <div className='space-y-4'>
      <section className='mx-4'>
        <h2 className='mb-2 text-lg'>Shoes</h2>
        <p className='mb-4'>Add new shoes here and track their mileage.</p>
        <ShoeList shoes={state.shoes.byId} />
      </section>
    </div>
  )
}

export default Shoes
