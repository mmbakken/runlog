export default {
  runs: {
    byId: {},
    isFetching: false,
    error: null,
    isSendingEdit: false, // TODO: maybe namespcae this by run id?
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
