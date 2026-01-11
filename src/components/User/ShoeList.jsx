import { useState, useContext } from 'react'
import { toast } from 'react-toastify'

import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'

import { formatActualMileage } from '../../formatters/formatMileage'

import Button from '../UI/Button'

const ShoeList = ({ shoes }) => {
  const [newShoeName, setNewShoeName] = useState('')
  const dispatch = useContext(StateContext)[1]

  const onNewShoeSubmit = (e) => {
    e.preventDefault()

    const newShoe = {
      title: newShoeName,
    }

    dispatch({
      type: actions.CREATE_SHOES__START,
    })

    APIv1.post('/shoes', newShoe)
      .then((response) => {
        dispatch({
          type: actions.CREATE_SHOES__SUCCESS,
          shoe: response.data,
        })

        toast.success('Shoes saved successfully.', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
      })
      .catch((error) => {
        console.error('Error while adding a new shoe:')
        console.dir(error)

        dispatch({
          type: actions.CREATE_SHOES__ERROR,
          error: error,
        })

        toast.error('Error adding shoes. Please try again later.', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
      })
      .finally(() => {
        setNewShoeName('')
      })
  }

  const deleteShoe = (shoeId) => {
    if (
      confirm(
        'Are you sure you want to delete this shoe? This action cannot be undone.'
      )
    ) {
      dispatch({
        type: actions.DELETE_SHOES__START,
      })

      APIv1.delete(`/shoes/${shoeId}`)
        .then((response) => {
          dispatch({
            type: actions.DELETE_SHOES__SUCCESS,
            shoe: response.data,
          })

          toast.success('Shoes deleted.', {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        })
        .catch((error) => {
          console.error('Error while deleting shoes:')
          console.dir(error)

          dispatch({
            type: actions.DELETE_SHOES__ERROR,
            error: error,
          })

          toast.error('Error deleting shoes. Please try again later.', {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
        })
    }
  }

  return (
    <div>
      {shoes != null ? (
        <div className='mb-4 grid grid-cols-(--shoe-list) gap-x-8 gap-y-2'>
          <div>Title</div>
          <div>Distance</div>
          <div>Runs</div>
          <div>Actions</div>

          {Object.keys(shoes).map((shoeId, index) => {
            const shoe = shoes[shoeId]

            return (
              <div key={`shoe-${index}`} className='contents'>
                <div>{shoe?.title}</div>
                <div>{formatActualMileage(shoe?.distance)} mi</div>
                <div>{shoe?.runIds?.length}</div>
                <div>
                  <Button
                    type='inline'
                    onClick={() => {
                      deleteShoe(shoe?._id)
                    }}
                  >
                    <span className='mr-2'>Delete</span>
                    <FontAwesomeIcon className='' icon={faTrashCan} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      <form
        className='mb-4'
        onSubmit={(e) => {
          onNewShoeSubmit(e)
        }}
      >
        <input
          className='mr-4 rounded border px-4 py-2'
          type='text'
          placeholder='e.g. Green Mizunos'
          value={newShoeName}
          onChange={(e) => {
            setNewShoeName(e.target.value)
          }}
        />

        <Button
          type='primary'
          role='submit'
          onClick={(e) => {
            onNewShoeSubmit(e)
          }}
        >
          Add shoes
        </Button>
      </form>
    </div>
  )
}

export default ShoeList
