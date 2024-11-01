import { useEffect, type MouseEvent } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AllRunsRoute } from 'app/routes'
import { useDeleteRunMutation } from 'app/features/api/apiSlice'

type RunActionsProps = {
  runId?: string
  stravaActivityId?: string
}

const RunActions = ({ runId, stravaActivityId }: RunActionsProps) => {
  const navigate = useNavigate()
  const [
    deleteRun,
    { isLoading: isDeleting, isSuccess: isSuccessfullyDeleted },
  ] = useDeleteRunMutation()

  // When the deletion request is successful, redirect user to the runs list.
  useEffect(() => {
    if (!isDeleting && isSuccessfullyDeleted) {
      toast.success('Run deleted', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })

      navigate(AllRunsRoute)
    }
  }, [navigate, isDeleting, isSuccessfullyDeleted])

  const handleDeleteButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (confirm('Are you sure you want to delete this run?')) {
      deleteRun({
        _id: runId ?? '',
      })
    }
  }

  // TODO: Use better Button  UI component.
  return (
    <div>
      <h2 className='block text-xl'>Actions</h2>
      <div className='mt-4 flex flex-col space-y-4 text-lg'>
        {stravaActivityId && (
          <a
            className='cursor-pointer font-bold hover:underline'
            target='_blank'
            rel='noopener noreferrer'
            href={`https://www.strava.com/activities/${stravaActivityId}`}
          >
            View on Strava
          </a>
        )}

        <button onClick={handleDeleteButtonClick}>Delete Run</button>
      </div>
    </div>
  )
}

export default RunActions
