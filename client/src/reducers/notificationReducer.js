import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: '',
    type: '',
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    displayNotification: (_, action) => ({
      message: action.payload.message,
      type: action.payload.type,
    }),
    // eslint-disable-next-line no-unused-vars
    removeNotification: (_, __) => ({
      message: '',
      type: '',
    }),
  },
})

export const { displayNotification, removeNotification } = notificationSlice.actions

export const setNotification = (notification, timeout) => (
  async (dispatch) => {
    dispatch(displayNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
)
export default notificationSlice.reducer

export const selectCurrentMessage = (state) => state.notification.message
export const selectCurrentType = (state) => state.notification.type
