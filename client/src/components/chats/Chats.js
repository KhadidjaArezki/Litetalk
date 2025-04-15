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
import SearchResult from '../search_result/SearchResult'
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

  function showChatsPageForNewUser(dummyUser) {
    if (friends?.length === 0 || (friends?.length === 1 && dummyUser)) {
      const styles = {
        margin: 0,
        marginTop: '24px',
        marginBottom: '16px',
      }
      return (
        <div id="chats" className="container main" style={{ marginTop: '24px' }}>
          <h3>
            {`👋 Hi ${username}! Welcome to LiteTalk!`}
          </h3>
          <h4>Search for your friends and add them</h4>
          <Button
            text="Start Search"
            className={`${btnStyles['button--start-a-search']}`}
            style={styles}
            onClick={() => navigate('/search')}
            icon={magnifyingGlass}
            iconAlt="magnifying glass"
          />
          <br />
          {dummyUser && (
            <>
              <h4>Or try the app by chatting with dummy_user</h4>
              <SearchResult
                result={dummyUser}
                container="people"
                modalTitle="Confirm Friend Request"
                getModalText={(name) => `Are you sure you want to add ${name} to your friends list ?`}
                confirmButtonText="Add"
                formHandler={() => null}
              />
            </>
          )}
        </div>
      )
    }
    return null
  }

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
    return showChatsPageForNewUser(dummyUser)
  }
  return showChatsPage()
}

export default Chats
