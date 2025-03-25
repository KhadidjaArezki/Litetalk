import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { selectCurrentId } from '../reducers/authReducer'
import { selectCurrentFriendId, appendMessage } from '../reducers/messageReducer'

export function initializeSocket(store) {
  const userId = useSelector(selectCurrentId)
  const currentFriendId = useSelector(selectCurrentFriendId)
  /* Create the socket client */
  const socket = io(process.env.REACT_APP_SOCKET_URL)
  // handle connection event sent from server
  socket.on('welcome', (message) => {
    console.log(message)
  })
  /* Add a function to handle the 'getMessage' event received from socket server */
  socket.on('getMessage', ({ senderId, message, timestamp }) => (
    /* Check to make sure that the received message was */
    /* from the friend we are chatting with in Chatroom */
    senderId === currentFriendId
    && store.dispatch(appendMessage({
      sender: senderId,
      receiver: userId,
      content: message,
      timestamp: timestamp ?? new Date().toISOString(),
    }))
  ))
  return socket
}
