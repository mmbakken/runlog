import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { DistanceTypes } from "app/types"

const DISTANCE_TYPES: Record<string, DistanceTypes> = {
  BETWEEN: "Between",
  LESS_THAN: "Less Than",
  MORE_THAN: "More Than",
}

export const DISTANCE_MIN_INIT = 0
export const DISTANCE_MAX_INIT = 100

export interface RunFiltersState {
  startDate: string
  endDate: string
  distanceType: DistanceTypes
  distance: number
  distanceMax: number
}

const initialState: RunFiltersState = {
  startDate: "",
  endDate: "",
  distanceType: DISTANCE_TYPES.BETWEEN,
  distance: DISTANCE_MIN_INIT,
  distanceMax: DISTANCE_MAX_INIT,
}

export const runFiltersSlice = createSlice({
  name: "runFilters",
  initialState,
  reducers: {
    selectedStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload
    },

    selectedEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload
    },

    selectedDistanceType: (state, action: PayloadAction<DistanceTypes>) => {
      state.distanceType = action.payload
    },

    selectedDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload
    },

    selectedDistanceMax: (state, action: PayloadAction<number>) => {
      state.distanceMax = action.payload
    },

    clickedResetFilters: (state) => {
      state.startDate = initialState.startDate
      state.endDate = initialState.endDate
      state.distanceType = initialState.distanceType
      state.distance = initialState.distance
      state.distanceMax = initialState.distanceMax
    },
  },
})

export const {
  selectedStartDate,
  selectedEndDate,
  selectedDistanceType,
  selectedDistance,
  selectedDistanceMax,
  clickedResetFilters,
} = runFiltersSlice.actions

export default runFiltersSlice.reducer

//=======================================
// Selectors
//=======================================

export const getStartDate = (state: RootState) =>
  state.runFiltersSlice.startDate

export const getEndDate = (state: RootState) => state.runFiltersSlice.endDate

export const getDistanceType = (state: RootState) =>
  state.runFiltersSlice.distanceType

export const getDistance = (state: RootState) => state.runFiltersSlice.distance

export const getDistanceMax = (state: RootState) =>
  state.runFiltersSlice.distanceMax
