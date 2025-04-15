import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../styles/ChatRoom-styles/MessageForms.module.css'
import sendIcon from '../../icons/chat-room/chatroom-send-icon.png'
import { selectCurrentFriendId, appendMessage } from '../../reducers/messageReducer'
import { useCreateTextMsgMutation } from '../../reducers/api/messageApiSlice'
import { selectCurrentId } from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'

function NewMessageForm({ socketSendHandler }) {
  const userId = useSelector(selectCurrentId)
  const currentFriendId = useSelector(selectCurrentFriendId)

  const dispatch = useDispatch()
  const [createTextMsg] = useCreateTextMsgMutation()

  const [errMsg, setErrMsg] = useState('')

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    const message = event.target.message.value
    const data = await createTextMsg({
      userId,
      friendId: currentFriendId,
      content: message,
      timestamp: new Date().toISOString(),
    })
    if (data.error) {
      setErrMsg('Failed to send message')
    } else {
      const createdMessage = data.data
      dispatch(appendMessage(createdMessage))
      event.target.message.value = '' // eslint-disable-line no-param-reassign
      socketSendHandler(message)
    }
  }

  return (
    <form
      className={styles['message-form']}
      onSubmit={handleSubmit}
    >
      <textarea
        required
        /* eslint-disable-next-line jsx-a11y/no-autofocus */
        autoFocus
        type="text"
        name="message"
        placeholder="Start typing ..."
      />
      <button
        className={styles['message-form__btn']}
        type="submit"
      >
        <img src={sendIcon} alt="paper dart" />
      </button>
    </form>
  )
}

export default NewMessageForm
