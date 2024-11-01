import actions from './actions'
import initialState from './initialState'
import runsReducer from './runs/runsReducer'
import shoesReducer from './shoesReducer'
import trainingReducer from './trainingReducer'

const stateReducer = (state, action) => {
  switch (action.type) {
    case actions.GET_ALL_RUNS__START:
    case actions.GET_ALL_RUNS__SUCCESS:
    case actions.GET_ALL_RUNS__ERROR:
    case actions.GET_RUN__START:
    case actions.GET_RUN__SUCCESS:
    case actions.GET_RUN__ERROR:
    case actions.EDIT_RUN__START:
    case actions.EDIT_RUN__SUCCESS:
    case actions.EDIT_RUN__ERROR:
    case actions.DELETE_RUN__START:
    case actions.DELETE_RUN__SUCCESS:
    case actions.DELETE_RUN__ERROR:
    case actions.SET_RUN_FILTERS__START_DATE:
    case actions.SET_RUN_FILTERS__END_DATE:
    case actions.SET_RUN_FILTERS__DISTANCE_MATCH_TYPE:
    case actions.SET_RUN_FILTERS__DISTANCE_VALUE:
    case actions.SET_RUN_FILTERS__DISTANCE_MAX_VALUE:
    case actions.CLEAR_RUN_FILTERS__START_DATE:
    case actions.CLEAR_RUN_FILTERS__ALL: {
      return {
        ...state,
        runs: runsReducer(state.runs, action),
      }
    }

    case actions.GET_ALL_SHOES__START:
    case actions.GET_ALL_SHOES__SUCCESS:
    case actions.GET_ALL_SHOES__ERROR:
    case actions.CREATE_SHOES__START:
    case actions.CREATE_SHOES__SUCCESS:
    case actions.CREATE_SHOES__ERROR:
    case actions.DELETE_SHOES__START:
    case actions.DELETE_SHOES__SUCCESS:
    case actions.DELETE_SHOES__ERROR: {
      return {
        ...state,
        shoes: shoesReducer(state.shoes, action),
      }
    }

    case actions.GET_ALL_TRAINING__START:
    case actions.GET_ALL_TRAINING__SUCCESS:
    case actions.GET_ALL_TRAINING__ERROR:
    case actions.GET_TRAINING_PLAN__START:
    case actions.GET_TRAINING_PLAN__SUCCESS:
    case actions.GET_TRAINING_PLAN__ERROR:
    case actions.CREATE_TRAINING_PLAN__START:
    case actions.CREATE_TRAINING_PLAN__SUCCESS:
    case actions.CREATE_TRAINING_PLAN__ERROR:
    case actions.UPDATE_TRAINING_PLAN__START:
    case actions.UPDATE_TRAINING_PLAN__SUCCESS:
    case actions.UPDATE_TRAINING_PLAN__ERROR:
    case actions.UPDATE_TRAINING_PLAN_DATE__START:
    case actions.UPDATE_TRAINING_PLAN_DATE__SUCCESS:
    case actions.UPDATE_TRAINING_PLAN_DATE__ERROR:
    case actions.DELETE_TRAINING__START:
    case actions.DELETE_TRAINING__SUCCESS:
    case actions.DELETE_TRAINING__ERROR: {
      return {
        ...state,
        training: trainingReducer(state.training, action),
      }
    }

    case actions.LOGOUT: {
      return {
        ...state,
        ...initialState,
      }
    }

    default: {
      throw new Error(`No action of type: "${action.type}"`)
    }
  }
}

export default stateReducer
