import { useState } from 'react'
import { useDebounce } from 'app/hooks'
import { useUpdateRunMutation } from 'app/features/api/apiSlice'
import type { ChangeEvent } from 'react'

type RunTitleProps = {
  initTitle?: string
  runId?: string
}

const RunTitle = ({ initTitle = '', runId = '' }: RunTitleProps) => {
  const [title, setTitle] = useState(initTitle)

  const [updateRun] = useUpdateRunMutation()

  const debouncedOnChange = useDebounce(() => {
    updateRun({
      _id: runId,
      title: title,
    })
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    debouncedOnChange()
  }

  // TODO: Improve UI here
  return (
    <div>
      <input
        onChange={handleChange}
        value={title}
        placeholder='Enter run title'
      />
    </div>
  )
}

export default RunTitle
