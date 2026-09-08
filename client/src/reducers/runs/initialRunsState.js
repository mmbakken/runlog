export default {
  byId: {},
  filteredIds: [],
  filters: {
    startDate: '',
    endDate: '',
    distance: {
      value: '', // Used as min when matchType is Between
      maxValue: '', // Used when matchType is Between
      matchType: 'Between', // Possible types: 'Exactly', 'Less Than', 'More Than', 'Between'
    },
  },
  isFetching: false,
  error: null,
  isSendingEdit: false, // TODO: This isn't used anywhere
  isDeleting: false,
}
