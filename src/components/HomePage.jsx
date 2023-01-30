import React from 'react'

import trainingImg from '../img/trainingCalendar.png'
import allRunsImg from '../img/allRuns.png'

const HomePage = () => {
  return (
    <div className='HomePage -mt-12'>
      <header className='flex flex-col justify-center h-200 max-h-screen mx-4 pt-32 pb-48 text-center border-b border-neutral-500'>
        <h1 className='text-8xl font-heading mt-12 mb-12'>runlog</h1>
        <p className='text-xl mb-4'>
          Better run training and tracking tools – no more spreadsheets.
        </p>
        <p className='font-mono'>
          [ by{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/mmbakken'
            className='hover:underline'
          >
            @mmbakken
          </a>
          &nbsp;]
        </p>
      </header>

      <section className='py-16 mx-4 flex flex-col sm:flex-row justify-between items-center space-y-4 md:space-x-24'>
        <div className='basis-2/3'>
          <img
            className='border rounded-lg mb-8 sm:mb-0'
            src={trainingImg}
            alt='A calendar component showing many recent workouts'
          />
        </div>

        <div className='basis-1/3'>
          <h2 className='text-3xl mb-4'>Training Calendar</h2>

          <ul className='text-xl space-y-4'>
            <li>
              <p>Plan your weekly training over months.</p>
            </li>
            <li>
              <p>Add workouts and categorize by their impact.</p>
            </li>
            <li>
              <p>
                As new runs are uploaded to Runlog, see the distances as they
                are added to the calendar.
              </p>
            </li>
            <li>
              <p>
                Copy and paste workouts and planned distances across days or
                weeks.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section className='py-16 mx-4 flex flex-col-reverse sm:flex-row justify-between items-center space-y-4 md:space-x-24 border-b border-neutral-500'>
        <div className='basis-1/3'>
          <h2 className='text-3xl mb-4'>Run Tracking</h2>

          <ul className='text-xl space-y-4'>
            <li>
              <p>View all of your recent runs in one simple list.</p>
            </li>
            <li>
              <p>
                Add more detailed notes to each run and track results, habit
                tracking like icing and stretching.
              </p>
            </li>
            <li>
              <p>
                Runlog is Powered by Strava and automatically pulls in your
                uploaded runs once uploaded there.
              </p>
            </li>
          </ul>
        </div>

        <div className='basis-2/3'>
          <img
            className='border rounded-lg mb-8 sm:mb-0'
            src={allRunsImg}
            alt='A calendar component showing many recent workouts'
          />
        </div>
      </section>
    </div>
  )
}

export default HomePage
