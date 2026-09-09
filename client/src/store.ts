import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { useDispatch, useSelector } from "react-redux"
import { runlogAPI } from "app/features/api/apiSlice"
import { runFiltersSlice } from "app/features/runs/filters/runFiltersSlice"

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [runlogAPI.reducerPath]: runlogAPI.reducer,
    runFiltersSlice: runFiltersSlice.reducer,
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(runlogAPI.middleware),
})

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for
// customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
