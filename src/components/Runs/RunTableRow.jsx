import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { ViewRunRoute } from 'app/routes'

// Unit formatting helper functions
import { formatActualMileage } from '../../formatters/formatMileage'
import formatPace from '../../formatters/formatPace'
import formatDuration from '../../formatters/formatDuration'
import formatHeartRate from '../../formatters/formatHeartRate'
import formatWeekday from '../../formatters/formatWeekday'
import { formatDate, formatDateShort } from '../../formatters/formatDate'

const RunTableRow = ({ run, showBottomBorder }) => {
  const navigate = useNavigate()

  if (run == null) {
    return null
  }

  const onRowClick = (runId) => {
    navigate(ViewRunRoute.split(':')[0].concat(runId))
  }

  return (
    <>
      <div
        className='RunTableRow mx-4 mt-2 flex max-h-60 cursor-pointer items-center rounded border border-neutral-600 bg-neutral-800 sm:mx-0 sm:contents'
        onClick={() => {
          onRowClick(run._id)
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

        <div className='shrink grow border-l border-r border-neutral-600 px-4 py-2 text-lg sm:hidden'>
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
        <div className='ml-2 hidden items-center py-1 pr-2 pr-4 hover:underline sm:flex md:pr-8'>
          {formatDate(run.startDate)}
        </div>

        <div className='hidden items-center py-1 pr-2 pr-4 hover:underline sm:flex md:pr-8'>
          {run.title}
        </div>

        <div className='hidden items-center justify-self-end py-1 pl-2 pl-4 hover:underline sm:flex md:pl-8'>
          {formatActualMileage(run.distance)}
        </div>

        <div className='hidden items-center justify-self-end py-1 pl-2 pl-4 hover:underline sm:flex md:pl-8'>
          {formatDuration(run.time)}
        </div>

        <div className='hidden items-center justify-self-end py-1 pl-2 pl-4 hover:underline sm:flex md:pl-8'>
          {formatPace(run.averageSpeed)}
        </div>

        <div className='hidden items-center justify-self-end py-1 pl-2 pl-4 hover:underline sm:flex md:pl-8'>
          {formatHeartRate(run.averageHeartRate)}
        </div>

        <div className='mr-4 hidden items-center justify-self-end py-1 pl-2 pl-4 hover:underline sm:flex md:pl-8'>
          {formatHeartRate(run.maxHeartRate)}
        </div>

        {showBottomBorder && (
          <div className='col-span-8 mx-4 mb-1 hidden border-b border-eggplant-700 pt-1 hover:underline sm:flex' />
        )}
      </div>

      {showBottomBorder && (
        <div className='mx-4 mb-3 mt-2 flex border-b-2 border-eggplant-700 pt-1 sm:hidden' />
      )}
    </>
  )
}

RunTableRow.propTypes = {
  run: PropTypes.object,
  showBottomBorder: PropTypes.bool,
}

export default RunTableRow
