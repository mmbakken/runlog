import CalendarDate from './CalendarDate'

type CalendarWeekRowProps = {
  dates: [
    {
      dateISO: string // ISO 8601, like 2022-03-29 TODO: Should this just be a string?
      actualDistance: number // Meters; Sum of all run distances that have actually happened on this date for this user
      plannedDistance: number // Miles; The user-entered mileage amount they plan to run on this date.
      plannedDistanceMeters: number // Meters; The user-entered mileage amount they plan to run on this date (used to compare with actualDistance fields)
      workout: string // Text description of this workout.
      workoutCategory: number // Index of the category enum, see runlog-api/constants/workoutCategories.js
      runIds: string[] // IDs of the run objects that happened on this date (local time)
    },
  ]
  weekIndex: number
  isLastRow: boolean
  selectedDateISO: string
  selectedWeekIndex: number
  hoveringWeekIndex: number
  focusWeekIndex: number
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  handleDateMenuOpen: () => void
  handleWeekFocus: (weekIndex: number) => void
  onWeekClick: (weekIndex: number) => void
  onDateEdit: () => void
  onDateClick: () => void
  disableSelection: boolean
  actualMileage: number
  percentDiff: number
}

const CalendarWeekRow = ({
  dates,
  weekIndex,
  isLastRow,
  selectedDateISO,
  selectedWeekIndex,
  hoveringWeekIndex,
  focusWeekIndex,
  handleMouseEnter,
  handleMouseLeave,
  handleDateMenuOpen,
  handleWeekFocus,
  onWeekClick,
  onDateEdit,
  onDateClick,
  disableSelection,
  actualMileage,
  percentDiff,
}: CalendarWeekRowProps) => {
  // Week selection UI
  let weekRowClasses = 'relative w-full flex'

  let mileageCellClasses =
    'w-20 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 bg-neutral-800 border-neutral-400 border-b border-r bg-neutral-800'

  let weekCellClasses =
    'w-20 grow-0 shrink-0 items-stretch flex flex-col items-center justify-center text-center px-2 py-1 bg-neutral-800 border-neutral-400 border-l border-r border-b transition'

  const isSelectedWeek = selectedWeekIndex === weekIndex
  const isHoveringWeek = hoveringWeekIndex === weekIndex
  const isFocusWeek = focusWeekIndex === weekIndex

  if (!disableSelection) {
    weekCellClasses += ' cursor-pointer'
  }

  if (!disableSelection && isSelectedWeek) {
    weekRowClasses +=
      ' outline outline-3 outline-eggplant-700 transition-outline drop-shadow z-10'
    mileageCellClasses +=
      ' border-eggplant-700 border-b-transparent border-r-transparent'
    weekCellClasses +=
      ' border-eggplant-700 border-b-transparent border-l-transparent'
    weekCellClasses += isHoveringWeek ? ' bg-eggplant-600' : ' bg-eggplant-700'
  }

  if (!disableSelection && !isSelectedWeek && isHoveringWeek) {
    weekCellClasses += ' bg-eggplant-700 border-eggplant-700'
  }

  if (isFocusWeek) {
    weekRowClasses += ' z-20'
  }

  return (
    <div className={weekRowClasses}>
      <div
        className={weekCellClasses}
        onClick={() => onWeekClick(weekIndex)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className='origin-center -rotate-90 whitespace-nowrap'>
          {`Week ${weekIndex + 1}`}
        </span>
      </div>

      {dates.map((date, dateIndex) => {
        return (
          <CalendarDate
            key={dateIndex}
            isSelectedDate={date.dateISO.split('T')[0] === selectedDateISO}
            isSelectedWeek={isSelectedWeek}
            onMenuOpen={handleDateMenuOpen}
            isLastRow={isLastRow}
            date={date}
            onDateEdit={onDateEdit}
            onDateClick={onDateClick}
            disableSelection={disableSelection}
            onFocus={() => {
              handleWeekFocus(weekIndex)
            }}
          />
        )
      })}

      <div className={mileageCellClasses}>
        <div className='mb-2 text-lg'>{actualMileage}</div>
        <div className='text-sm text-gray-400'>{percentDiff}</div>
      </div>
    </div>
  )
}

export default CalendarWeekRow
