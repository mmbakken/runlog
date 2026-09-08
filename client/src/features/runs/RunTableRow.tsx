import { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ViewRunRoute } from 'app/routes'
import {
  formatActualMileage,
  formatPace,
  formatDuration,
  formatHeartRate,
  formatWeekday,
  formatDate,
  formatDateShort,
} from 'app/formatters'
import { Run } from 'app/types'

type RunTableRowProps = {
  run: Run
  showBottomBorder: boolean
}

const RunTableRow = ({ run, showBottomBorder }: RunTableRowProps) => {
  const navigate = useNavigate()

  if (run == null) {
    return null
  }

  // When a run is clicked on, navigate to that Run's details page.
  const onRowClick = (runId: string) => {
    navigate(ViewRunRoute.split(':')[0].concat(runId))
  }

  // Allow keyboard users to interact with run row elements.
  const handleRowKeydown = (
    event: KeyboardEvent<HTMLDivElement>,
    runId: string
  ) => {
    if (event.key === 'Enter') {
      onRowClick(runId)
    }
  }

  return (
    <>
      <div
        className='mx-4 mt-2 flex max-h-60 cursor-pointer items-center rounded border border-neutral-600 bg-neutral-800 sm:mx-0 sm:contents'
        role='link'
        tabIndex={0}
        onClick={() => {
          onRowClick(run._id)
        }}
        onKeyDown={(event) => {
          handleRowKeydown(event, run._id)
        }}
      >
        {/* Narrow UI. Uses flex layout. */}
        <div className='flex w-12 shrink-0 grow-0 flex-col items-center py-2 text-xs sm:hidden'>
          <div className='flex items-center'>
            {formatWeekday(run.startDate)}
          </div>
          <div className='flex items-center'>
            {formatDateShort(run.startDate)}
          </div>
        </div>

        <div className='shrink grow border-r border-l border-neutral-600 px-4 py-2 text-lg sm:hidden'>
          {run.title}
        </div>

        <div className='flex w-20 shrink-0 grow-0 flex-col items-center space-y-1 py-2 text-sm sm:hidden'>
          <div className='flex items-center'>
            {formatActualMileage(run.distance)} mi
          </div>

          <div className='flex items-center text-xs text-neutral-400'>
            {formatPace(run.averageSpeed)}
          </div>
        </div>

        {/* Wide UI. Uses grid layout. */}
        <div className='ml-4 hidden items-center py-1 hover:underline sm:flex'>
          {formatWeekday(run.startDate)}
        </div>
        <div className='ml-2 hidden items-center py-1 hover:underline sm:flex md:pr-8'>
          {formatDate(run.startDate)}
        </div>

        <div className='hidden items-center py-1 hover:underline sm:flex md:pr-8'>
          {run.title}
        </div>

        <div className='hidden items-center justify-self-end py-1 hover:underline sm:flex md:pl-8'>
          {formatActualMileage(run.distance)}
        </div>

        <div className='hidden items-center justify-self-end py-1 hover:underline sm:flex md:pl-8'>
          {formatDuration(run.time)}
        </div>

        <div className='hidden items-center justify-self-end py-1 hover:underline sm:flex md:pl-8'>
          {formatPace(run.averageSpeed)}
        </div>

        <div className='hidden items-center justify-self-end py-1 hover:underline sm:flex md:pl-8'>
          {formatHeartRate(run.averageHeartRate)}
        </div>

        <div className='mr-4 hidden items-center justify-self-end py-1 hover:underline sm:flex md:pl-8'>
          {formatHeartRate(run.maxHeartRate)}
        </div>

        {showBottomBorder && (
          <div className='col-span-8 mx-4 mb-1 hidden border-b border-eggplant-700 pt-1 hover:underline sm:flex' />
        )}
      </div>

      {showBottomBorder && (
        <div className='mx-4 mt-2 mb-3 flex border-b-2 border-eggplant-700 pt-1 sm:hidden' />
      )}
    </>
  )
}

export default RunTableRow
