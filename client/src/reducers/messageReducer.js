/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'

const storedCurrentFriendId = localStorage.getItem('current_friend_id')
const storedChats = localStorage.getItem('chats')
  ? JSON.parse(localStorage.getItem('chats'))
  : []

const initialState = {
  currentFriendId: storedCurrentFriendId ?? '',
  chats: storedChats ?? [],
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.chats = action.payload
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
    setCurrentFriendId: (state, action) => {
      const currentFriendId = action.payload
      state.currentFriendId = currentFriendId
      localStorage.setItem('current_friend_id', currentFriendId)
    },
    appendMessage: (state, action) => {
      /* If a chat's friendId is not equal to the current friend id, */
      /* return chat, else return a new chat object that contains    */
      /* an updated messages array with the new message.             */
      if (state.chats.length === 0) {
        state.chats = [{
          friendId: state.currentFriendId,
          messages: [action.payload],
        }]
      } else {
        state.chats = state.chats.map((chat) => (
          chat.friendId !== state.currentFriendId
            ? chat
            : {
              ...chat,
              messages: chat.messages.concat(action.payload),
            }
        ))
      }
      localStorage.setItem('chats', JSON.stringify(state.chats))
    },
  },
})

export const { setMessages, setCurrentFriendId, appendMessage } = messagesSlice.actions

export default messagesSlice.reducer
export const selectCurrentFriendId = (state) => state.messages.currentFriendId
export const selectCurrentChats = (state) => state.messages.chats
