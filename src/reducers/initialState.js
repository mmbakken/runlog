export default {
  runs: {
    byId: {},
    isFetching: false,
    error: null,
    isSendingEdit: false, // TODO: This isn't used anywhere
    isDeleting: false,
  },

  dailyStats: {
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
