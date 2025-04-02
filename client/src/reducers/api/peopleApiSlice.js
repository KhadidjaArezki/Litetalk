// Extend apiSlice
import { apiSlice } from './apiSlice'

const PEOPLE_URI = process.env.REACT_APP_BASE_PEOPLE_URL

const peopleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.mutation({
      query: (searchObj) => ({
        url: PEOPLE_URI,
        method: 'POST',
        body: searchObj,
      }),
    }),
  }),
})

export const {
  useSearchMutation,
} = peopleApiSlice
