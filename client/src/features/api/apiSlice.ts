import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { DistanceTypes, Run, Shoe } from "app/types"

const baseUrl = import.meta.env.DEV
  ? "http://localhost:4000/api/v1"
  : "https://www.runlog.dev/api/v1"

export const runlogAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "omit",
    headers: new Headers({
      Authorization: localStorage.getItem("token") ?? "",
      "Content-type": "application/json",
    }),
  }),
  tagTypes: ["Run", "Shoe"],
  endpoints: (builder) => ({
    //=======================================
    // Runs
    //=======================================

    // The query accepts an id string and returns a Run.
    getRun: builder.query<Run, string>({
      query: (_id) => ({ url: `runs/${_id}` }),
      providesTags: ["Run"],
    }),

    // The query accepts an filters object and returns a map of Runs by id.
    getRuns: builder.query<
      Record<string, Run>,
      {
        startDate: string
        endDate: string
        distanceType: DistanceTypes
        distance: number
        distanceMax: number
      }
    >({
      query: (arg) => {
        const { startDate, endDate, distanceType, distance, distanceMax } = arg

        return {
          url: "runs/",
          params: {
            startDate,
            endDate,
            distanceType,
            distance,
            distanceMax,
          },
        }
      },
      providesTags: ["Run"],
    }),

    // The mutation accepts a Partial<Run> arg, and returns a Run.
    updateRun: builder.mutation<Run, Partial<Run> & Pick<Run, "_id">>({
      query: ({ _id, ...updates }) => ({
        url: `runs/${_id}`,
        method: "PUT",
        body: {
          updates,
        },
      }),
      invalidatesTags: ["Run"],

      // Implements an optimistic update, so the user can see their edits now.
      async onQueryStarted({ _id, ...updates }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          runlogAPI.util.updateQueryData("getRun", _id, (draft) => {
            Object.assign(draft, updates)
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    deleteRun: builder.mutation<Run, Pick<Run, "_id">>({
      query: ({ _id }) => ({
        url: `runs/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Run"],
    }),

    //=======================================
    // Shoes
    //=======================================

    // The query returns a map of Shoes by id.
    getShoes: builder.query<Record<string, Shoe>, void>({
      query: () => ({ url: `shoes` }),
      providesTags: ["Shoe"],
    }),
  }),
})

export const {
  useGetRunQuery,
  useGetRunsQuery,
  useUpdateRunMutation,
  useDeleteRunMutation,
  useGetShoesQuery,
} = runlogAPI
