import initialRunsState from './runs/initialRunsState'

export default {
  runs: initialRunsState,

  shoes: {
    byId: {},
    isFetching: false,
    error: null,
  },

  training: {
    byId: {},
    isFetching: false,
    activePlan: null,
    error: null,
  },
}
