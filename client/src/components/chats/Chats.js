import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectCurrentUsername,
  selectCurrentFriends,
} from '../../reducers/authReducer'
import { setCurrentFriendId } from '../../reducers/messageReducer'
import StartAChatButton from '../button/StartAChatButton'
import ModalStartAChat from '../modal/ModalStartAChat'
import LatestChats from './LatestChats'
import Button from '../button/Button'
import btnStyles from '../../styles/Button.module.css'
import magnifyingGlass from '../../icons/searchbox/magnifying-glass.png'

function Chats() {
  // Get the current user state
  const username = useSelector(selectCurrentUsername)
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

  if (friends?.length) {
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
  } return (
    <div id="chats" className="container main">
      <h1>
        {`Hello ${username}! Welcome to LiteTalk!`}
      </h1>
      <h2>
        Only few more
        <span className="italic"> lite </span>
        steps...
      </h2>
      <h4>...to connect and chat with your friends!</h4>
      <br />
      <h4>To look for your friends and add them to your contacts list</h4>
      <h4>click the search button below</h4>
      <h4>Your friends will get your messages after they add you</h4>
      <Button
        text="Start Search"
        className={btnStyles['button--start-a-search']}
        onClick={() => navigate('/search')}
        icon={magnifyingGlass}
        iconAlt="magnifying glass"
      />
    </div>
  )
}

export default Chats
