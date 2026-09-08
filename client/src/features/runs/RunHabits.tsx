import { useState } from 'react'
import { useUpdateRunMutation } from 'app/features/api/apiSlice'
import { HABIT_TYPES } from 'app/features/runs'
import type { ChangeEvent } from 'react'
import type { HabitTypes } from 'app/types'

type RunHabitsProps = {
  initHabits: {
    stretch?: boolean
    strength?: boolean
    ice?: boolean
  }
  runId?: string
}

const RunHabits = ({
  initHabits = {
    stretch: false,
    strength: false,
    ice: false,
  },
  runId = '',
}: RunHabitsProps) => {
  const [isChecked, setIsChecked] = useState({
    stretch: initHabits.stretch,
    strength: initHabits.strength,
    ice: initHabits.ice,
  })
  const [updateRun] = useUpdateRunMutation()

  const handleHabitsChange = (habit: HabitTypes, value: boolean) => {
    setIsChecked({
      ...isChecked,
      [habit]: !isChecked[habit],
    })
    updateRun({
      _id: runId,
      [habit]: value,
    })
  }

  return (
    <div>
      <h2 className='block text-xl'>Habits</h2>
      <div className='mt-3 flex flex-col space-y-4'>
        <label className='flex cursor-pointer items-center text-lg'>
          <input
            type='checkbox'
            className='mr-3'
            checked={isChecked.stretch}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleHabitsChange(HABIT_TYPES.STRETCH, event.target.checked)
            }}
          />
          Stretched
        </label>

        <label className='flex cursor-pointer items-center text-lg'>
          <input
            type='checkbox'
            className='mr-3'
            checked={isChecked.strength}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleHabitsChange(HABIT_TYPES.STRENGTH, event.target.checked)
            }}
          />
          Strength
        </label>

        <label className='flex cursor-pointer items-center text-lg'>
          <input
            type='checkbox'
            className='mr-3'
            checked={isChecked.ice}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              handleHabitsChange(HABIT_TYPES.ICE, event.target.checked)
            }}
          />
          Iced
        </label>
      </div>
    </div>
  )
}

export default RunHabits
