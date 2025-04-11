/* eslint no-shadow: 0 */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, resetCredentials } from '../authReducer'
import { saveProfilePictureToDB } from '../thunk/authThunks'

const BASE_URL = process.env.REACT_APP_BASE_URL
const REFRESH_URI = process.env.REACT_APP_REFRESH_URI

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // Send back http-only secure cookie with each authed query
  credentials: 'include',
  // Attach token to headers on each query
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

/* Create a custom query function to wrap base query,
 * so if request fails with an unauthorized error,
 * we can resend the request after getting a new token.
 */
let refreshPromise = null // refresh lock using a Promise

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  // If token has expired, send a request to get a new token
  if (result?.error?.status === 403 || result?.error?.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        console.log('Refresh token expired. Sending request for new token')
        const refreshResult = await baseQuery(REFRESH_URI, api, extraOptions)
        if (refreshResult?.data) {
          const userState = api.getState().auth
          await api.dispatch(setCredentials({
            ...userState,
            ...refreshResult.data,
          }))
          return refreshResult.data
        }
        // If user is not authorized to get token, log out
        await baseQuery(
          {
            url: REFRESH_URI,
            method: 'DELETE',
          },
          api,
          extraOptions,
        )
        await api.dispatch(saveProfilePictureToDB(null))
        await api.dispatch(resetCredentials())
        return null
      })()
    }
    const newTokenData = await refreshPromise
    refreshPromise = null
    if (newTokenData) {
      // Retry original request with the new token
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  // You can extend api slices in authApiReducer
  // to separate auth functionality from other features
  // eslint-disable-next-line no-unused-vars
  endpoints: (builder) => ({}),
})
