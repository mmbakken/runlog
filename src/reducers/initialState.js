import initialRunsState from './runs/initialRunsState'

export default {
  runs: initialRunsState,

  training: {
    byId: {},
    isFetching: false,
    activePlan: null,
    error: null,
  },
}
