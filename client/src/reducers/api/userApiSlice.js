// Extend apiSlice
import { apiSlice } from './apiSlice'

const USER_URI = process.env.REACT_APP_USER_URI

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({
        id, username, email, picture, friends,
      }) => ({
        url: `${USER_URI}/${id}`,
        method: 'PUT',
        body: {
          username, email, picture, friends,
        },
      }),
    }),
    removeUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URI}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useUpdateUserMutation,
  useRemoveUserMutation,
} = userApiSlice
