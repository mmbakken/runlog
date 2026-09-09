import { DateTime } from "luxon"
import { showWeekDivider } from "app/utils"
import RunTableRow from "./RunTableRow"
import { Run } from "app/types"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"

type RunTableBodyProps = {
  runsById: Record<string, Run>
  isLoading: boolean
  isError: boolean
  error: FetchBaseQueryError | SerializedError | undefined
}

// Displays a list of runs as a table.
const RunTableBody = ({
  runsById,
  isLoading,
  isError,
  error,
}: RunTableBodyProps) => {
  if (isLoading) {
    return <div className="mx-4 w-full">Loading...</div>
  }

  // TODO: Show error UI inside the table body
  if (isError) {
    return (
      <div className="mx-4 w-full">
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  // TODO: We should show a UI for "No runs found" state.
  if (runsById == null || Object.keys(runsById).length === 0) {
    return null
  }

  const sortedRuns = Object.values(runsById).sort((a, b) => {
    return a.startDate < b.startDate ? 1 : -1
  })

  return sortedRuns.map((run, rowIndex, runsArray) => {
    // Timezone field has a format like "(GMT-07:00) America/Denver" so this
    // just ignores the offset and uses the location. This is what Luxon wants.
    const tz = run.timezone.split(" ")[1]

    // Make sure to interpret this run's start date in the timezone where the
    // run actually happened, not the timezone of this browser.
    const date = DateTime.fromISO(run.startDate, { zone: tz })

    let addWeekBorder = false

    if (runsArray[rowIndex + 1]) {
      const nextDate = DateTime.fromISO(runsArray[rowIndex + 1].startDate, {
        zone: tz,
      })

      addWeekBorder = showWeekDivider(date, nextDate)
    }

    return (
      <RunTableRow key={rowIndex} run={run} showBottomBorder={addWeekBorder} />
    )
  })
}

export default RunTableBody
