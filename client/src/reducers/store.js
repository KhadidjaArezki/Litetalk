import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authReducer'
import messageReducer from './messageReducer'
import notificationReducer from './notificationReducer'
import { apiSlice } from './api/apiSlice'

// eslint-disable-next-line import/prefer-default-export
const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    messages: messageReducer,
    notification: notificationReducer,
  },
  // This required for RTK Query to cache results
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(apiSlice.middleware),
  devTools: true,
})

export default store
