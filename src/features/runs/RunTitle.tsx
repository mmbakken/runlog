import { useRef, useState } from 'react'
import cn from 'classnames'
import { useDebounce } from 'app/hooks'
import { useUpdateRunMutation } from 'app/features/api/apiSlice'
import type { ChangeEvent, KeyboardEvent } from 'react'

type RunTitleProps = {
  initTitle?: string
  runId?: string
}

const RunTitle = ({ initTitle = '', runId = '' }: RunTitleProps) => {
  const titleButtonRef = useRef<HTMLButtonElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initTitle)

  const [updateRun] = useUpdateRunMutation()

  const debouncedOnChange = useDebounce(() => {
    updateRun({
      _id: runId,
      title: title,
    })
  })

  const buttonClasses1 = cn(
    'cursor-pointer absolute',
    { 'z-10 opacity-0': isEditing },
    { 'z-20': !isEditing }
  )

  const buttonClasses = 'hidden'

  const inputClasses = cn(
    'absolute w-auto',
    { 'z-20': isEditing },
    { 'z-10': !isEditing }
  )

  //===============================================
  // Event Handlers
  //===============================================

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      handleTitleClick()
    }
  }

  const handleTitleClick = () => {
    setIsEditing(true)
    titleInputRef.current?.focus()
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    titleButtonRef.current?.focus()
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      handleInputBlur()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    debouncedOnChange()
  }

  // TODO: Improve UI here
  return (
    <header className='relative pb-4 text-2xl'>
      <button
        ref={titleButtonRef}
        aria-label='Edit run title'
        className={buttonClasses}
        onClick={handleTitleClick}
        onKeyDown={handleTitleKeyDown}
      >
        {title}
      </button>
      <input
        ref={titleInputRef}
        className={inputClasses}
        onChange={handleChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        value={title}
        placeholder='Enter run title'
      />
    </header>
  )
}

export default RunTitle
