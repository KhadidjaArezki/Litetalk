import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { selectCurrentFriends } from '../../reducers/authReducer'
import { setCurrentFriendId } from '../../reducers/messageReducer'
import styles from '../../styles/SearchResults.module.css'
import btnStyles from '../../styles/Button.module.css'
import AddFriendButton from '../button/AddFriendButton'
import UnfriendButton from '../button/UnfriendButton'
import StartAChatButton from '../button/StartAChatButton'
import Modal from '../modal/Modal'
import defaultPicture from '../../icons/default-user-profile-image.png'

function SearchResult({
  result,
  container,
  modalTitle,
  getModalText,
  buttonClasses,
  confirmButtonText,
  formHandler,
}) {
  const friends = useSelector(selectCurrentFriends)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const modalRef = useRef()
  const searchResultContainer = container === 'people'
    ? 'search-result'
    : 'search-result--friends'

  const showButton = () => {
    const friend = friends.find((f) => f.id === result.id)
    if (container === 'people') {
      if (friend) {
        return (
          <StartAChatButton
            handleOnClick={() => {
              dispatch(setCurrentFriendId(friend.id))
              navigate('/chatroom')
            }}
            btnText=""
            btnStyles={btnStyles['button--start-a-chat-in-search']}
          />
        )
      }
      return (
        <AddFriendButton
          handleAddFriendClick={() => modalRef.current.showModal()}
        />
      )
    }
    return (
      <>
        <UnfriendButton
          handleUnfriendClick={() => modalRef.current.showModal()}
        />
        <StartAChatButton
          handleOnClick={() => {
            dispatch(setCurrentFriendId(friend.id))
            navigate('/chatroom')
          }}
          btnText=""
          btnStyles={btnStyles['button--start-a-chat--friends']}
        />
      </>
    )
  }

  return (
    <div className={styles[searchResultContainer]} data-id={result.id}>
      <div className={styles['search-result__description']}>
        <div className={styles['search-result__image']}>
          <img src={result.picture || defaultPicture} alt={result.username} />
        </div>
        <div className={styles['search-result__text']}>
          <p>{result.username}</p>
        </div>
      </div>
      <div className={styles['search-result__buttons']}>
        {showButton()}
      </div>

      <Modal
        ref={modalRef}
        title={modalTitle}
        text={getModalText(result.username)}
        onRequestClose={() => modalRef.current.close()}
        confirmButtonText={confirmButtonText}
        buttonClasses={buttonClasses}
        formHandler={formHandler}
        formHandlerArgument={result.id}
      />
    </div>
  )
}

export default SearchResult
