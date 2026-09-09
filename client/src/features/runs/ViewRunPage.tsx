import { useParams } from "react-router-dom"
import {
  RunActions,
  RunHabits,
  RunResults,
  RunShoes,
  RunStats,
  RunTitle,
} from "app/features/runs"
import { useGetRunQuery } from "app/features/api/apiSlice"

const ViewRunPage = () => {
  const { runId } = useParams<{ runId: string }>()
  const id = runId ?? ""
  const { data: run, isLoading, isSuccess, isError, error } = useGetRunQuery(id)

  // TODO: Better loading UI (skeleton?)
  if (isLoading) {
    return <div className="w-full p-4">Loading run...</div>
  }

  // TODO: Better 404 run page UI.
  if (isSuccess && run == null) {
    return <div className="w-full p-4">No run found :(</div>
  }

  // TOOD: Better error UI.
  if (isError) {
    return (
      <div className="w-full p-4">
        <h1>Error while fetching run.</h1>
        {error != null && <pre>{JSON.stringify(error, null, 2)}</pre>}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4 px-4 pb-4">
      <RunTitle initTitle={run?.title} runId={run?._id} />

      <section className="flex flex-col items-start space-y-6">
        <RunStats
          startDate={run?.startDate}
          timezone={run?.timezone}
          startLocation={run?.startLocation}
          distance={run?.distance}
          time={run?.time}
          averageSpeed={run?.averageSpeed}
          hasHeartRate={run?.hasHeartRate}
          heartRateAvg={run?.averageHeartRate}
          heartRateMax={run?.maxHeartRate}
        />
        <RunResults initResults={run?.results} runId={run?._id} />
        <RunShoes initShoeId={run?.shoeId} runId={run?._id} />
        <RunHabits
          initHabits={{
            stretch: run?.stretch,
            strength: run?.strength,
            ice: run?.ice,
          }}
          runId={run?._id}
        />
        <RunActions runId={run?._id} stravaActivityId={run?.stravaActivityId} />
      </section>
    </div>
  )
}

export default ViewRunPage
