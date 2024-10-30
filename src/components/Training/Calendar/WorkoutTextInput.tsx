import { useState, useRef } from 'react'

type WorkoutTextInputProps = {
  initialText?: string
  onChange: (text: string) => void
}

const DEBOUNCE_DELAY_MS = 500

const WorkoutTextInput = ({ initialText, onChange }: WorkoutTextInputProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const [inputText, setInputText] = useState(initialText)

  // Debounce the call to onChange.
  const debouncedOnChange = (input: string) => {
    // Always update local state so the UI stays responsive.
    setInputText(input)

    // Cancel previously scheduled update.
    clearTimeout(timeoutRef.current)

    // Schedule an update with the new value.
    timeoutRef.current = setTimeout(() => {
      onChange(input)
    }, DEBOUNCE_DELAY_MS)
  }

  return (
    <div className='h-28 w-full'>
      <textarea
        className='size-full cursor-default resize-none bg-transparent px-2 py-1 text-sm outline-none'
        spellCheck={false}
        value={inputText}
        onChange={(event) => {
          debouncedOnChange(event.target.value)
        }}
      />
    </div>
  )
}

export default WorkoutTextInput
