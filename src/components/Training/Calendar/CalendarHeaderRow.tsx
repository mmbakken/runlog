const CalendarHeaderRow = () => {
  return (
    <div className='sticky top-0 z-30 flex w-full border-neutral-400'>
      <div
        className={
          'flex w-20 shrink-0 grow-0 flex-col items-stretch justify-center border border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Week
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Monday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Tuesday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Wednesday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Thursday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Friday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Saturday
      </div>
      <div
        className={
          'w-48 shrink-0 border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'
        }
      >
        Sunday
      </div>
      <div className='flex w-20 shrink-0 grow-0 flex-col items-stretch justify-center border-y border-r border-neutral-400 bg-neutral-800 p-2 text-center'>
        Total
      </div>
    </div>
  )
}

export default CalendarHeaderRow
