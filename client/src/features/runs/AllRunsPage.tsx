import RunsList from "app/features/runs/RunsList"
import RunFilters from "app/features/runs/filters/RunFilters"

const AllRunsPage = () => {
  return (
    <div>
      <RunFilters />
      <RunsList />
    </div>
  )
}

export default AllRunsPage
