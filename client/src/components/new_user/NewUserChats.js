import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentChats, setMessages, setCurrentFriendId } from '../../reducers/messageReducer'
import {
  selectCurrentId,
  selectCurrentFriends,
} from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { useGetAllMessagesMutation } from '../../reducers/api/messageApiSlice'
import { sortArrayOfObjects } from '../../utils/helper'
import SearchResult from '../search_result/SearchResult'
import Button from '../button/Button'
import LatestChat from '../chats/LatestChat'
import btnStyles from '../../styles/Button.module.css'
import magnifyingGlass from '../../icons/searchbox/magnifying-glass.png'

function NewUserChats({ dummyUser }) {
  const id = useSelector(selectCurrentId)
  const friends = useSelector(selectCurrentFriends)
  const chatsData = useSelector(selectCurrentChats)
  const [getAllMessages] = useGetAllMessagesMutation()

  const [latestChat, setLatestChat] = useState({
    id: '',
    username: '',
    picture: '',
    message: '',
    timestamp: '',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    (async () => {
      const data = await getAllMessages({ id })
      if (data.error) {
        dispatch(setMessages(chatsData))
        setErrMsg('Failed to get new chats')
      } else {
        const messages = data.data
        dispatch(setMessages(messages))
      }
    })()
  }, [friends])

  useEffect(() => {
    if (errMsg) {
      dispatch(setNotification(
        {
          message: errMsg,
          type: 'error',
        },
        5,
      ))
      setErrMsg('')
    }
  }, [errMsg])

  useEffect(() => {
    (async () => {
      const currentChat = chatsData[0]
      const friendId = currentChat?.friendId
      const friend = friends.find((contact) => contact.id.toString() === friendId)
      if (friend) {
        const messagePicture = friend.picture
        const messageUsername = friend.username
        const allMessages = currentChat.messages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
        const latestMessage = sortArrayOfObjects(allMessages, 'timestamp', 'desc', 'firstItem')
        if (latestMessage) {
          const messageContent = latestMessage.content
          const messageTimestamp = latestMessage.timestamp
          const newInstance = {
            id: friendId,
            picture: messagePicture,
            username: messageUsername,
            message: messageContent,
            timestamp: messageTimestamp,
          }
          setLatestChat(newInstance)
        }
      }
    })()
  }, [chatsData])

  const styles = {
    marginTop: '24px',
    gap: '20px',
  }
  return (
    <div id="welcome" className="container main" style={styles}>
      <h3 style={{ color: '#3498db', fontWeight: '600' }}>
        Welcome to LiteTalk!
      </h3>
      <Button
        text="Start Search"
        className={`${btnStyles['button--start-a-search']}`}
        style={{
          margin: 0,
          marginTop: '24px',
          marginBottom: '16px',
        }}
        onClick={() => navigate('/search')}
        icon={magnifyingGlass}
        iconAlt="magnifying glass"
      />
      <br />
      {dummyUser && (
        <>
          <h4 style={{ color: '#3498db' }}>
            Try the app by chatting with dummy_user
          </h4>
          { chatsData.length === 0
            ? (
              <SearchResult
                result={dummyUser}
                container="people"
                modalTitle="Confirm Friend Request"
                getModalText={(name) => `Are you sure you want to add ${name} to your friends list ?`}
                confirmButtonText="Add"
                formHandler={() => null}
              />
            )
            : latestChat.id && (
              <LatestChat
                key={latestChat.id}
                id={latestChat.id}
                username={latestChat.username}
                picture={latestChat.picture}
                timestamp={latestChat.timestamp}
                message={latestChat.message}
                onOpenAChatClick={() => {
                  dispatch(setCurrentFriendId(dummyUser.id))
                  navigate('/chatroom')
                }}
              />
            )}
        </>
      )}
    </div>
  )
}

export default NewUserChats
