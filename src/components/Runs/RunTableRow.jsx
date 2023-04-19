import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ViewRunRoute } from '../../constants/routes'

// Unit formatting helper functions
import { formatActualMileage } from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'
import formatHeartRate from '../../formatters/formatHeartRate'
import formatWeekday from '../../formatters/formatWeekday'
import { formatDate, formatDateShort } from '../../formatters/formatDate'

const RunTableRow = ({ run, showBottomBorder }) => {
  const history = useHistory()

  if (run == null) {
    return null
  }

  const onRowClick = (runId) => {
    history.push(ViewRunRoute.split(':')[0].concat(runId))
  }

  return (
    <>
      <div
        className='RunTableRow sm:contents sm:mx-0 max-h-60 cursor-pointer mt-2 mx-4 flex items-center border rounded border-neutral-600 bg-neutral-800'
        onClick={() => {
          onRowClick(run._id)
        }}
      >
        {/* Narrow UI. Uses flex layout. */}
        <div className='sm:hidden grow-0 shrink-0 w-12 flex flex-col items-center text-xs py-2'>
          <div className='flex items-center'>
            {formatWeekday(run.startDate)}
          </div>
          <div className='flex items-center'>
            {formatDateShort(run.startDate)}
          </div>
        </div>

        <div className='sm:hidden grow shrink px-4 py-2 border-l border-r border-neutral-600 text-lg'>
          {run.title}
        </div>

        <div className='sm:hidden space-y-1 grow-0 shrink-0 w-20 flex flex-col items-center py-2 text-sm'>
          <div className='flex items-center'>
            {formatActualMileage(run.distance)} mi
          </div>

          <div className='flex items-center text-xs text-neutral-400'>
            {formatPace(run.averageSpeed)}
          </div>
        </div>

        {/* Wide UI. Uses grid layout. */}
        <div className='hidden sm:flex hover:underline py-1 items-center ml-4'>
          {formatWeekday(run.startDate)}
        </div>
        <div className='hidden sm:flex hover:underline py-1 items-center ml-2 pr-2 pr-4 md:pr-8'>
          {formatDate(run.startDate)}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center pr-2 pr-4 md:pr-8'>
          {run.title}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center justify-self-end pl-2 pl-4 md:pl-8'>
          {formatActualMileage(run.distance)}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center justify-self-end pl-2 pl-4 md:pl-8'>
          {formatDuration(run.time)}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center justify-self-end pl-2 pl-4 md:pl-8'>
          {formatPace(run.averageSpeed)}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center justify-self-end pl-2 pl-4 md:pl-8'>
          {formatHeartRate(run.averageHeartRate)}
        </div>

        <div className='hidden sm:flex hover:underline py-1 items-center justify-self-end pl-2 pl-4 md:pl-8 mr-4'>
          {formatHeartRate(run.maxHeartRate)}
        </div>

        {showBottomBorder && (
          <div className='hidden sm:flex hover:underline col-span-8 pt-1 mb-1 mx-4 border-b border-eggplant-700' />
        )}
      </div>

      {showBottomBorder && (
        <div className='sm:hidden flex pt-1 mt-2 mb-3 mx-4 border-b-2 border-eggplant-700' />
      )}
    </>
  )
}

RunTableRow.propTypes = {
  run: PropTypes.object,
  showBottomBorder: PropTypes.bool,
}

export default RunTableRow
