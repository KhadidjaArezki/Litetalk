import { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { selectCurrentFriends } from '../../reducers/authReducer'
import styles from '../../styles/ChatRoom-styles/Messages.module.css'
import Message from '../message/Message'
import { selectCurrentChats, selectCurrentFriendId } from '../../reducers/messageReducer'

function Messages() {
  const friends = useSelector(selectCurrentFriends)
  const chats = useSelector(selectCurrentChats)
  const currentFriendId = useSelector(selectCurrentFriendId)
  /* Get the chat object that corresponds to the      */
  /* currently selected friend from the messages state */
  const currentFriendChat = chats.find((chat) => chat.friendId === currentFriendId)
  const currentFriendMessages = currentFriendChat?.messages ?? []

  /* Get the user information of the currently selected */
  /* user from the friends array in the user store      */
  const currentFriendInfo = friends.find((f) => f.id === currentFriendId)
  /* Pass a ref hook to each message in order to auto scroll */
  /* to the bottom of each message that is displayed         */
  const scrollRef = useRef()

  /* Auto scroll to bottom on each successfully-added message */
  useEffect(() => {
    (async () => {
      scrollRef.current?.scrollIntoView(false, { behavior: 'smooth' })
    })()
  }, [chats])

  return (
    <div className={styles.messages}>
      { currentFriendMessages?.length === 0
        && (
          <h4>
            {`This is the start of your conversations with 
            ${friends.find((f) => f.id === currentFriendId).username}`}
          </h4>
        )}
      { currentFriendMessages?.map((message) => (
        <Message
          ref={scrollRef}
          key={nanoid()}
          senderId={message.sender}
          content={message.content}
          time={message.timestamp}
          currentFriend={currentFriendInfo}
        />
      ))}
    </div>
  )
}

export default Messages
