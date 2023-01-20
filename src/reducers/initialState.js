export default {
  runs: {
    byId: {},
    isFetching: false,
    error: null,
    isSendingEdit: false, // TODO: This isn't used anywhere
    isDeleting: false,
  },

  training: {
    byId: {},
    isFetching: false,
    activePlan: null,
    error: null,
  },
}
