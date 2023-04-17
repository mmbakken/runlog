export default {
  runs: {
    byId: {},
    filteredIds: [],
    filters: {
      startDate: '',
      endDate: '',
    },
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
