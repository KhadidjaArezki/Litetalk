// Extend apiSlice
import { apiSlice } from './apiSlice'

const MESSAGE_URI = process.env.REACT_APP_MESSAGE_URI

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllMessages: builder.mutation({
      query: ({ id }) => ({
        url: `${MESSAGE_URI}/${id}`,
        method: 'GET',
      }),
    }),
    createTextMsg: builder.mutation({
      query: (newTextMsg) => ({
        url: MESSAGE_URI,
        method: 'POST',
        body: { ...newTextMsg },
      }),
    }),
    createImageMsg: builder.mutation({
      query: ({
        userId, friendId, image, timestamp,
      }) => {
        const body = new FormData()
        body.append('userId', userId)
        body.append('friendId', friendId)
        body.append('timestamp', timestamp)
        body.append('image', image)
        return {
          url: MESSAGE_URI,
          method: 'POST',
          body,
        }
      },
    }),
  }),
})

export const {
  useGetAllMessagesMutation,
  useCreateTextMsgMutation,
  useCreateImageMsgMutation,
} = messageApiSlice
