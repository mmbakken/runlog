import { useState } from 'react'
import {
  useGetShoesQuery,
  useUpdateRunMutation,
} from 'app/features/api/apiSlice'
import type { ChangeEvent } from 'react'

type RunShoesProps = {
  initShoeId?: string | null
  runId?: string
}

const RunShoes = ({ initShoeId, runId = '' }: RunShoesProps) => {
  const [shoeId, setShoeId] = useState(initShoeId ?? '')
  const {
    data: shoesById,
    isLoading,
    // isSuccess,
    isError,
    error,
  } = useGetShoesQuery()
  const [updateRun] = useUpdateRunMutation()

  // TODO: Better error UI
  if (isError) {
    console.error(error)
    return null
  }

  const shoes = shoesById == null ? [] : Object.values(shoesById)

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newShoeId = event.target.value

    // No shoe found - reset to initial state or empty state.
    if (newShoeId == null || newShoeId === '') {
      setShoeId(initShoeId ?? '')
      return
    }

    setShoeId(newShoeId)
    updateRun({
      _id: runId,
      shoeId: newShoeId,
    })
  }

  const id = 'view-run-shoe-select'

  // TODO: Build a better Dropdown UI component
  return (
    <div className='w-full sm:w-80'>
      <label htmlFor={id} className='mb-3 block text-xl'>
        Shoes
      </label>
      <select
        id={id}
        value={shoeId}
        onChange={handleChange}
        className='w-40 bg-black bg-opacity-50'
      >
        <option key={'Empty option'} value=''>
          {isLoading ? '' : 'Select a shoe'}
        </option>

        {!isLoading &&
          shoes.map((shoe) => {
            return (
              <option key={shoe._id} value={shoe._id}>
                {shoe.title}
              </option>
            )
          })}
      </select>
    </div>
  )
}

export default RunShoes
