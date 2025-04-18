import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
  removeFriend,
} from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'
import SearchBox from '../searchbox/SearchBox'
import SearchResults from '../search_results/SearchResults'
import { useUpdateUserMutation } from '../../reducers/api/userApiSlice'

function Friends() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { file } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends)

  const [errMsg, setErrMsg] = useState('')

  const [updateUser] = useUpdateUserMutation()
  const dispatch = useDispatch()

  /* Initially, theh component renders the entire friends list */
  const [currentResults, setCurrentResults] = useState([...friends])
  const container = 'Friends'

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

  /* Re-render component every time friends are updated
   * Compare friends and current results to find a
   * friend that has been unfriended, i.e., a friend
   * that is in current results but no longer in friends.
   * Render the updated results if a friend has been
   * removed or the entire friends list if not.
   */
  useEffect(() => {
    const removedFriend = currentResults.find((friend) => (
      !friends.some((f) => f.id === friend.id)
    ))
    const updatedResults = removedFriend
      ? currentResults.filter((f) => f.id !== removedFriend.id)
      : friends

    setCurrentResults(updatedResults)
  }, [friends])

  /* Find friends with usernames that        */
  /* include search keywords and render them */
  const handleSearch = (event) => {
    event.preventDefault()
    const searchKeywords = event.target.search.value

    const results = friends.filter((friend) => (
      friend.username.includes(searchKeywords)))
    setCurrentResults(results)
  }

  /* Dispatch unfriend action with an object       */
  /* containing user info and a list of all friend */
  /* ids except for the id of the unfriended friend  */
  const handleUnfriend = async (friendId) => {
    const getNewFriends = () => {
      const friendsIds = friends.map((friend) => friend.id)
      friendsIds.splice(friendsIds.indexOf(friendId), 1)
      return friendsIds
    }
    const pictureFileToSend = file?.data
      ? new File(
        [new Blob([new Uint8Array(file.data.data)], { type: file.contentType })],
        `${username}.${file.contentType.substring(file.contentType.indexOf('/') + 1)}`,
        { type: file.contentType },
      )
      : null
    const data = await updateUser({
      id,
      username,
      email,
      picture: pictureFileToSend,
      friends: getNewFriends(),
    })
    if (data.error) {
      setErrMsg('Failed to remove friend')
    } else {
      const updatedUser = data.data
      const updatedFriends = updatedUser.friends
      /* Find the friend that is in currentFriends but not in updatedFriends */
      const friendToRemove = friends.find(
        (friend) => !updatedFriends.some((f) => f.id === friend.id),
      )
      dispatch(removeFriend(friendToRemove.id))
    }
  }

  return (
    <div id="friends" className="container main">

      <SearchBox searchHandler={handleSearch} container={container} />
      <SearchResults
        results={currentResults}
        container={container}
        modalTitle="Confirm Unfriend"
        getModalText={(name) => `Are you sure you want to unfriend ${name} ?`}
        confirmButtonText="Unfriend"
        buttonClasses="button--danger"
        formHandler={handleUnfriend}
      />

    </div>
  )
}

export default Friends
