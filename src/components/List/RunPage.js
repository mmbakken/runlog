import React from 'react'
import { useParams } from 'react-router-dom'

const RunPage = () => {
  const params = useParams()

  console.dir(params)

  return <div className='RunPage w-full px-4 pb-4 space-y-4'>RunPage</div>
}

export default RunPage
