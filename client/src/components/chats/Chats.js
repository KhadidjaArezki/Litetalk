import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentFriends } from '../../reducers/authReducer'
import { setCurrentFriendId } from '../../reducers/messageReducer'
import StartAChatButton from '../button/StartAChatButton'
import ModalStartAChat from '../modal/ModalStartAChat'
import LatestChats from './LatestChats'
import btnStyles from '../../styles/Button.module.css'
import NewUserChats from '../new_user/NewUserChats'

function Chats() {
  // Get the current user state
  const friends = useSelector(selectCurrentFriends)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const modalRef = useRef()

  // Handling the click on the selected chat or friend
  const onOpenAChatClick = (currentFriendId) => {
    dispatch(setCurrentFriendId(currentFriendId))
    navigate('/chatroom')
  }

  const onOpenModal = () => modalRef.current.showModal()
  const onCloseModal = () => modalRef.current.close()

  function showChatsPage() {
    const dummyUser = friends?.find((f) => f.username === 'dummy_user')
    if (friends?.length > 1 || (friends?.length === 1 && !dummyUser)) {
      return (
        <div id="chats" className="container main">
          <StartAChatButton
            handleOnClick={onOpenModal}
            btnText="Start a chat"
            btnStyles={btnStyles['button--start-a-chat']}
          />
          <ModalStartAChat
            friends={friends}
            ref={modalRef}
            onCloseModal={onCloseModal}
            onOpenAChatClick={onOpenAChatClick}
          />
          <LatestChats onOpenAChatClick={onOpenAChatClick} />
        </div>
      )
    }
    return <NewUserChats dummyUser={dummyUser} />
  }
  return showChatsPage()
}

export default Chats
