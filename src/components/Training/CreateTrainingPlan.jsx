import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { DateTime } from 'luxon'

import { StateContext } from '../../context/StateContext'
import { AuthContext } from '../../context/AuthContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'

import nextUpcomingWeekStart from '../../utils/nextUpcomingWeekStart.js'
import { AllTrainingPlansRoute } from '../../constants/routes'

import Checkbox from '../Forms/Checkbox'
import Button from '../UI/Button'

const CreateTrainingPlan = () => {
  const dispatch = useContext(StateContext)[1]
  const auth = useContext(AuthContext)[0]
  const now = useState(DateTime.local())[0]
  const history = useHistory()

  const DEFAULT_WEEK_COUNT = 8 // Seems like a reasonable training plan length
  const DEFAULT_WEEK_STARTS_ON = 1 // Monday
  const DAYS_PER_WEEK = 7
  const DEFAULT_TITLE = ''
  const DEFAULT_START_DATE = nextUpcomingWeekStart(
    now.toISODate(),
    auth?.user?.stats?.weekStartsOn || DEFAULT_WEEK_STARTS_ON
  )

  // Tracks local state info about the unsaved training plan. This data will be converted to the
  // expected format (and required fields) before being sent to the API for creation.
  const [newTrainingPlan, setTrainingPlan] = useState({
    startDate: DEFAULT_START_DATE,
    startDateISO: DEFAULT_START_DATE.toISODate(),
    weekCount: DEFAULT_WEEK_COUNT,
    endDate: DEFAULT_START_DATE.plus({
      days: DEFAULT_WEEK_COUNT * DAYS_PER_WEEK - 1,
    }),
    endDateISO: DEFAULT_START_DATE.plus({
      days: DEFAULT_WEEK_COUNT * DAYS_PER_WEEK - 1,
    }).toISODate(),
    timezone: now.zoneName,
    title: DEFAULT_TITLE,
    goal: '',
    isActive: false,
  })

  // Have the necessary fields been added?
  const allowCreation =
    newTrainingPlan.title != null &&
    newTrainingPlan.title.length > 0 &&
    newTrainingPlan.goal != null &&
    newTrainingPlan.goal.length > 0 &&
    newTrainingPlan.startDate != null &&
    newTrainingPlan.startDateISO != null &&
    newTrainingPlan.weekCount != null &&
    newTrainingPlan.endDate != null &&
    newTrainingPlan.endDateISO != null

  const handleSubmit = (e) => {
    e.preventDefault()

    const newPlan = {
      startDate: newTrainingPlan.startDateISO,
      endDate: newTrainingPlan.endDateISO,
      weekCount: Number.parseInt(newTrainingPlan.weekCount),
      title: newTrainingPlan.title,
      goal: newTrainingPlan.goal,
      timezone: newTrainingPlan.timezone,
      isActive: newTrainingPlan.isActive,
    }

    dispatch({
      type: actions.CREATE_TRAINING_PLAN__START,
      plan: newPlan,
    })

    APIv1.post('/training', newPlan)
      .then((response) => {
        dispatch({
          type: actions.CREATE_TRAINING_PLAN__SUCCESS,
          plan: response.data.plan,
        })

        history.push(AllTrainingPlansRoute)
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
    // TODO: Need to ensure that the user picks a date which is the start of a week

    const newStartDate = DateTime.fromISO(newDate)

    if (!newStartDate.isValid) {
      console.error(`Invalid start date selected: ${newDate}`)
      return

      // TODO: Set an error UI state and describe the error to the user
    }

    const newEndDate = newStartDate.plus({
      days: DAYS_PER_WEEK * newTrainingPlan.weekCount - 1,
    })

    // TODO: If this happens it's likely bc the weekCount is not a number
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
      days: DAYS_PER_WEEK * Number.parseInt(newWeekCount) - 1,
    })
    setTrainingPlan({
      ...newTrainingPlan,
      weekCount: newWeekCount,
      endDate: endDate,
      endDateISO: endDate.toISODate(),
    })
  }

  // Handler for user toggling isActive checkbox
  const toggleIsActive = () => {
    setTrainingPlan({
      ...newTrainingPlan,
      isActive: !newTrainingPlan.isActive,
    })
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4 space-y-4'>
      <h1 className='text-2xl'>New Training Plan</h1>
      <form onSubmit={handleSubmit} className='w-full'>
        <div className='w-full flex space-x-8 mt-4'>
          <label className='w-full max-w-lg text-lg'>
            Title
            <input
              type='text'
              required
              autoFocus
              placeholder='What race are you training for?'
              value={newTrainingPlan.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className='text-base w-full rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
            />
          </label>
        </div>

        <div className='w-full flex space-x-8 mt-4'>
          <label className='w-full max-w-lg text-lg'>
            Goal
            <textarea
              type='text'
              required
              placeholder='What do you want to achieve?'
              value={newTrainingPlan.goal}
              onChange={(e) => onGoalChange(e.target.value)}
              className='text-base w-full h-36 rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
            />
          </label>
        </div>

        <div className='flex space-x-8 mt-4'>
          <label className='text-lg'>
            Start Date
            <input
              type='date'
              value={newTrainingPlan.startDateISO}
              onChange={(e) => onDateChange(e.target.value)}
              className='text-base rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
            />
          </label>

          <label className='text-lg'>
            Weeks
            <input
              type='number'
              value={newTrainingPlan.weekCount}
              min='1'
              max='52'
              onChange={(e) => onWeekCountChange(e.target.value)}
              className='text-base rounded px-2 py-2 block mt-2 border border-neutral-200 bg-neutral-800'
            />
          </label>

          <label className='text-lg'>
            End Date
            <input
              disabled
              type='date'
              value={newTrainingPlan.endDateISO}
              className='text-base rounded py-2 block mt-2 bg-transparent'
            />
          </label>
        </div>

        <div className='text-lg flex space-x-8 mt-4'>
          <label className='text-base block flex flex-col items-start'>
            Active Plan
            <span className='block text-base text-neutral-500'>
              Is this your current training plan?
            </span>
            <Checkbox
              className='mt-2'
              onChange={() => toggleIsActive()}
              checked={newTrainingPlan.isActive}
            />
          </label>
        </div>

        <div className='mt-6'>
          <Button type='primary' disabled={!allowCreation}>
            Create Plan
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrainingPlan
