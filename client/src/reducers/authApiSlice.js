// Extend apiSlice
import { apiSlice } from './apiSlice'

const LOGIN_URI = process.env.REACT_APP_LOGIN_URI
const LOGOUT_URI = process.env.REACT_APP_LOGOUT_URI
const SIGNUP_URI = process.env.REACT_APP_SIGNUP_URI

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: LOGIN_URI,
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: LOGOUT_URI,
        method: 'DELETE',
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: SIGNUP_URI,
        method: 'POST',
        body: { ...credentials },
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation, // auto-generated hooks
} = authApiSlice
