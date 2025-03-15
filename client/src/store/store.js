import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../reducers/authReducer'
import usersReducer from './features/users/usersSlice'
import { apiSlice } from '../reducers/apiSlice'
import messagesReducer from './features/messages/messagesSlice'

// eslint-disable-next-line import/prefer-default-export
const store = configureStore({
  reducer: {
    user: usersReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    messages: messagesReducer,
  },
  // This required for RTK Query to cache results
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export default store
