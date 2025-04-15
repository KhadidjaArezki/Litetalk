import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../../context/socketContext'
import { selectCurrentId } from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'
import styles from '../../styles/ChatRoom-styles/MessageForms.module.css'
import NewMessageForm from '../new_message_form/NewMessageForm'
import NewPictureButton from '../button/NewPictureButton'
import defaultPicture from '../../icons/img-file-placeholder.png'
import ImageModal from '../modal/ImageModal'
import { selectCurrentFriendId, appendMessage } from '../../reducers/messageReducer'
import { useCreateImageMsgMutation } from '../../reducers/api/messageApiSlice'

function MessageForms() {
  const userId = useSelector(selectCurrentId)
  const currentFriendId = useSelector(selectCurrentFriendId)

  const [createImageMsg] = useCreateImageMsgMutation()
  /* Create the socket client */
  const socket = useSocket()

  const imageModalRef = useRef()
  const dispatch = useDispatch()

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

  useEffect(() => {
    /* Dispatch an addUser event to add current user   */
    /* to the users connected to the socket server now */
    socket.emit('addUser', userId)
    /* Add a function to handle the 'getUsers' event received from the socket sever
     * This does nothing. It's for testing purposes and can be removed
    socket.on('getUsers', (users) => {
      console.log(users)
    })
    */
  }, [])

  /* Dispatch a 'sendMessage' event to send message to socket server */
  const sendMessagetoSocket = (message) => {
    socket.emit('sendMessage', ({
      senderId: userId,
      receiverId: currentFriendId,
      message,
    }))
  }

  const SendPictureFormHandler = async (imgFile) => {
    const data = await createImageMsg({
      userId,
      friendId: currentFriendId,
      image: imgFile,
      timestamp: new Date().toISOString(),
    })
    if (data.error) {
      setErrMsg('Failed to send picture')
    } else {
      const createdMessage = data.data
      dispatch(appendMessage(createdMessage))
      sendMessagetoSocket(imgFile)
    }
  }

  return (
    <div className={styles['message-forms']}>
      <NewMessageForm socketSendHandler={sendMessagetoSocket} />
      <NewPictureButton clickHandler={() => imageModalRef.current.showModal()} />

      <ImageModal
        ref={imageModalRef}
        title="Send a picture"
        defaultPicture={defaultPicture}
        imageAlt="picture preview"
        formHandler={SendPictureFormHandler}
        confirmButtonText="send"
        uploadButtonText="upload picture"
        useCameraButtonText="use camera"
      />
    </div>
  )
}

export default MessageForms
