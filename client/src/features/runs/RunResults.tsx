import { useState } from "react"
import { useDebounce } from "app/hooks"
import { useUpdateRunMutation } from "app/features/api/apiSlice"
import type { ChangeEvent } from "react"

type RunResultsProps = {
  initResults?: string | null
  runId?: string
}

const RunResults = ({ initResults = "", runId = "" }: RunResultsProps) => {
  const [results, setResults] = useState(initResults ?? "")

  const [updateRun] = useUpdateRunMutation()

  const debouncedOnChange = useDebounce(() => {
    updateRun({
      _id: runId,
      results: results,
    })
  })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResults(e.target.value)
    debouncedOnChange()
  }

  // TODO: Use a UI component for the textarea
  return (
    <div className="w-full max-w-screen-sm">
      <label className="block w-full text-xl">
        Results
        <textarea
          className="mt-3 block h-60 max-h-120 w-full overflow-scroll rounded border border-neutral-200 bg-neutral-800 p-2 text-base sm:h-48"
          placeholder="How was your run?"
          value={results}
          onChange={handleChange}
        />
      </label>
    </div>
  )
}

export default RunResults
