import React, { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useHistory } from 'react-router-dom'
import { StateContext } from '../../context/StateContext'
import actions from '../../reducers/actions'
import { APIv1 } from '../../api'
import { AllTrainingPlansRoute } from '../../constants/routes'

const AllTrainingPlans = () => {
  const [state, dispatch] = useContext(StateContext)
  const [isOptionMenuVisible, setIsOptionMenuVisible] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const id = location.pathname.split('/training/')[1]

  let optionMenuClasses =
    'absolute left-8 top-0 space-y-1 border rounded border-gray-900 bg-offwhite-100 z-10'
  let maskClasses =
    'fixed w-screen h-screen bg-gray-900 opacity-10 left-0 top-0'
  if (isOptionMenuVisible) {
    optionMenuClasses += ' block'
    maskClasses += ' block'
  } else {
    optionMenuClasses += ' hidden'
    maskClasses += ' hidden'
  }

  useEffect(() => {
    // Allow user to hide the option menu with ESC key or a click outside of the menu
    const handleEscPress = (event) => {
      if (event.keyCode === 27) {
        setIsOptionMenuVisible(false)
      }
    }

    window.addEventListener('keydown', handleEscPress)

    dispatch({
      type: actions.GET_TRAINING_PLAN__START,
    })

    APIv1.get(`/training/${id}`)
      .then((response) => {
        dispatch({
          type: actions.GET_TRAINING_PLAN__SUCCESS,
          plan: response.data,
        })
      })
      .catch((error) => {
        dispatch({
          type: actions.GET_TRAINING_PLAN__ERROR,
          error: error,
        })
      })

    // Unregister listeners on dismount
    return () => {
      window.removeEventListener('keydown', handleEscPress)
    }
  }, [])

  const onEditClick = () => {
    console.log('TODO onEditClick')
  }
  const onToggleIsActiveClick = () => {
    console.log('TODO onToggleIsActiveClick')
  }
  const onDuplicateClick = () => {
    console.log('TODO onDuplicateClick')
  }

  const onDeleteClick = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the training plan "${state.training.byId[id].title}"? This action cannot be undone.`
      )
    ) {
      dispatch({
        type: actions.DELETE_TRAINING__START,
      })

      APIv1.delete(`/training/${id}`)
        .then(() => {
          dispatch({
            type: actions.DELETE_TRAINING__SUCCESS,
            id: id,
          })

          // TODO: This should be a toast so the user can see it when the route changes
          console.log(`Deleted training plan with id ${id}`)

          history.push(AllTrainingPlansRoute)
        })
        .catch((error) => {
          dispatch({
            type: actions.DELETE_TRAINING__ERROR,
            error: error,
          })
        })
    }
  }

  const onMenuClick = () => {
    setIsOptionMenuVisible(!isOptionMenuVisible)
  }

  const onMaskClick = () => {
    setIsOptionMenuVisible(false)
  }

  return (
    <div className='TrainingPage w-full px-4 pb-4'>
      {state.training.isFetching && (
        <div>
          <span>Loading...</span>
        </div>
      )}

      {!state.training.isFetching &&
        state.training.byId &&
        state.training.byId[id] && (
          <div className='w-full mb-4'>
            <div className='flex space-x-4 items-center'>
              <h1 className='shrink-1 text-2xl'>
                {state.training.byId[id].title}
              </h1>
              <div className='relative grow-0 shrink-0'>
                <button
                  className='text-xs px-2 py-1 border border-gray-700 rounded bg-offwhite-100 hover:bg-offwhite-200 transition cursor-pointer'
                  onClick={() => {
                    onMenuClick()
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>

                <div className={optionMenuClasses}>
                  <ul className='flex flex-col w-max space-y-1'>
                    <li
                      className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                      onClick={() => {
                        onEditClick()
                      }}
                    >
                      Edit plan
                    </li>
                    <li
                      className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                      onClick={() => {
                        onToggleIsActiveClick()
                      }}
                    >
                      {state.training.byId[id].isActive
                        ? 'Mark as plan as inactive'
                        : 'Mark plan as active'}
                    </li>
                    <li
                      className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                      onClick={() => {
                        onDuplicateClick()
                      }}
                    >
                      Duplicate plan
                    </li>
                    <li
                      className='px-2 py-1 hover:bg-eggplant-600 hover:text-white cursor-pointer transition'
                      onClick={() => {
                        onDeleteClick()
                      }}
                    >
                      Delete plan
                    </li>
                  </ul>
                </div>

                <div
                  className={maskClasses}
                  onClick={() => {
                    onMaskClick()
                  }}
                />
              </div>
            </div>
            <h2 className='mt-2 mb-4'>Goal: {state.training.byId[id].goal}</h2>

            <pre className='font-mono text-sm w-120 max-h-120 min-h-16 border bg-gray-100 border-gray-900 rounded overflow-scroll break-words px-2 py-1'>
              {JSON.stringify(state.training.byId[id], null, 2)}
            </pre>
          </div>
        )}

      {!state.training.isFetching && state.training.byId[id] == null && (
        <div className='mb-4'>No training plan found with id {id}</div>
      )}
    </div>
  )
}

export default AllTrainingPlans
