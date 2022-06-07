import React, { useState, useEffect, useContext } from 'react'
import { DateTime } from 'luxon'
import { StateContext } from '../../context/StateContext'
import { AuthContext } from '../../context/AuthContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'
import nextUpcomingWeekStart from '../../utils/nextUpcomingWeekStart.js'

const CreateTrainingPlan = () => {
  const dispatch = useContext(StateContext)[1]
  const auth = useContext(AuthContext)[0]
  const now = useState(DateTime.local())[0]
  const DEFAULT_WEEK_COUNT = 8 // Seems like a reasonable training plan length
  const DEFAULT_WEEK_STARTS_ON = 1 // Monday
  const DAYS_PER_WEEK = 7
  const DEFAULT_TITLE = 'New Training Plan'

  // Tracks local state info about the unsaved training plan. This data will be converted to the
  // expected format (and required fields) before being sent to the API for creation.
  const [newTrainingPlan, setTrainingPlan] = useState({
    startDate: nextUpcomingWeekStart(
      now.toISODate(),
      auth?.user?.stats?.weekStartsOn || DEFAULT_WEEK_STARTS_ON
    ),
    startDateISO: nextUpcomingWeekStart(
      now.toISODate(),
      auth?.user?.stats?.weekStartsOn || DEFAULT_WEEK_STARTS_ON
    ).toISODate(),
    weekCount: DEFAULT_WEEK_COUNT,
    endDate: now.plus({ days: DEFAULT_WEEK_COUNT * DAYS_PER_WEEK - 1 }),
    endDateISO: now
      .plus({ days: DEFAULT_WEEK_COUNT * DAYS_PER_WEEK - 1 })
      .toISODate(),
    timezone: now.zoneName,
    title: DEFAULT_TITLE,
    goal: '',
  })

  useEffect(() => {
    console.log(`Timezone string: ${DateTime.local().zoneName}`)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    // TODO: Convert the newTrainingPlan state into the values the API cares about
    setTrainingPlan({
      ...newTrainingPlan,
      startDate: newTrainingPlan.startDate.toISODate(),
      endDate: newTrainingPlan.endDate.toISODate(),
    })

    dispatch({
      action: actions.CREATE_TRAINING_PLAN__START,
      plan: newTrainingPlan,
    })

    APIv1.post('/plans')
      .then((response) => {
        dispatch({
          type: actions.CREATE_TRAINING_PLAN__SUCCESS,
          plan: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.CREATE_TRAINING_PLAN__ERROR,
          error: error,
        })
      })
  }

  // Handler to update the title of the training plan
  const onTitleChange = (newTitle) => {
    setTrainingPlan({
      ...newTrainingPlan,
      title: newTitle,
    })
  }

  // Handler to update the goal of the training plan
  const onGoalChange = (newGoal) => {
    setTrainingPlan({
      ...newTrainingPlan,
      goal: newGoal,
    })
  }

  // Handler to update the start of the training plan
  const onDateChange = (newDate) => {
    // TODO: Date validation and formatting
    // - Must be on the start of a week (user-defined setting)
    // - Ensure yyyy-mm-dd format

    const newStartDate = DateTime.fromISO(newDate)

    if (!newStartDate.isValid) {
      console.error(`Invalid start date selected: ${newDate}`)
      return
    }

    const newEndDate = newStartDate.plus({
      days: DAYS_PER_WEEK * newTrainingPlan.weekCount,
    })

    if (!newEndDate.isValid) {
      console.error('Invalid end date after changing start date!')
      return
    }

    return setTrainingPlan({
      ...newTrainingPlan,
      startDate: newStartDate,
      startDateISO: newStartDate.toISODate(),
      endDate: newEndDate,
      endDateISO: newEndDate.toISODate(),
    })
  }

  // Handler to update the end date of the training plan
  const onWeekCountChange = (newWeekCount) => {
    const endDate = newTrainingPlan.startDate.plus({
      days: DAYS_PER_WEEK * newWeekCount,
    })
    setTrainingPlan({
      ...newTrainingPlan,
      weekCount: newWeekCount,
      endDate: endDate,
      endDateISO: endDate.toISODate(),
    })
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4 space-y-4'>
      <h1 className='text-xl'>New Training Plan</h1>
      <form onSubmit={handleSubmit} className='space-y-2'>
        <label>
          Title
          <input
            type='text'
            placeholder='What are you training for?'
            value={newTrainingPlan.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className='block mt-1'
          />
        </label>

        <label>
          Goal
          <textarea
            type='text'
            placeholder='What do you want to achieve?'
            value={newTrainingPlan.goal}
            onChange={(e) => onGoalChange(e.target.value)}
            className='block mt-1'
          />
        </label>

        <div className='flex space-x-4'>
          <label>
            Start Date
            <input
              type='date'
              value={newTrainingPlan.startDateISO}
              onChange={(e) => onDateChange(e.target.value)}
              className='block mt-1'
            />
          </label>

          <label>
            Weeks
            <input
              type='number'
              value={newTrainingPlan.weekCount}
              min='1'
              max='52'
              onChange={(e) => onWeekCountChange(e.target.value)}
              className='block mt-1'
            />
          </label>

          <label>
            End Date
            <input
              disabled
              type='date'
              value={newTrainingPlan.endDateISO}
              className='block mt-1'
            />
          </label>
        </div>

        <button
          className='px-4 py-2 border text-white border-gray-900 rounded bg-eggplant-700 hover:bg-eggplant-600 transition focus:outline-none'
          type='submit'
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default CreateTrainingPlan
