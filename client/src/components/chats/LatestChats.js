import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentChats, setMessages } from '../../reducers/messageReducer'
import {
  selectCurrentId,
  selectCurrentFriends,
} from '../../reducers/authReducer'
import { useGetAllMessagesMutation } from '../../reducers/api/messageApiSlice'
import { sortArrayOfObjects } from '../../utils/helper'
import ContainerHeading from '../container_heading/ContainerHeading'
import LatestChat from './LatestChat'

function LatestChats({ onOpenAChatClick }) {
  const id = useSelector(selectCurrentId)
  const friends = useSelector(selectCurrentFriends)
  const chatsData = useSelector(selectCurrentChats)
  const [getAllMessages] = useGetAllMessagesMutation()

  const [latestChats, setLatestChats] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
      const messages = await getAllMessages({ id }).unwrap()
      dispatch(setMessages(messages))
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const latestChatsUnsorted = chatsData.reduce(
        (newArr, currentChat) => {
          //  Use provided friend id (from user messages) to get the friend from the friends data
          const { friendId } = currentChat
          const friend = friends.find((contact) => contact.id.toString() === friendId)

          /* This check is to handle the case where someone
           * whose not in our friends list sent us messages
           */
          if (friend) {
            const messagePicture = friend.picture
            const messageUsername = friend.username
            const allMessages = currentChat.messages.map((message) => ({
              ...message,
              timestamp: new Date(message.timestamp),
            }))
            /*  Use helper function to sort these messages and return only the latest message */
            const latestMessage = sortArrayOfObjects(allMessages, 'timestamp', 'desc', 'firstItem')

            // This check is for handling the case of a no messages
            if (latestMessage) {
              // Use the latest message to get the timestamp and the message content
              const messageContent = latestMessage.content
              const messageTimestamp = latestMessage.timestamp
              // Define new object with all prepared data
              const newInstance = {
                id: friendId,
                picture: messagePicture,
                username: messageUsername,
                message: messageContent,
                timestamp: messageTimestamp,
              }
              newArr.push(newInstance)
            }
          }
          return newArr
        },
        [],
      )
      // Set state
      setLatestChats(sortArrayOfObjects(latestChatsUnsorted, 'timestamp', 'desc', 'array'))
    })()
  }, [chatsData])

  return chatsData
    ? (
      <>
        {latestChats.length > 0 && <ContainerHeading text="Latest Chats" />}
        <div>
          {
            latestChats.map((chat) => (
              <LatestChat
                key={chat.id}
                id={chat.id}
                username={chat.username}
                picture={chat.picture}
                timestamp={chat.timestamp}
                message={chat.message}
                onOpenAChatClick={onOpenAChatClick}
              />
            ))
          }
        </div>
      </>
    ) : null
}

export default LatestChats
