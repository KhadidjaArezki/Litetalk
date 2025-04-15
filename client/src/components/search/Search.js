import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
  appendFriend,
} from '../../reducers/authReducer'
import { setNotification } from '../../reducers/notificationReducer'
import SearchBox from '../searchbox/SearchBox'
import SearchResults from '../search_results/SearchResults'
import { useUpdateUserMutation } from '../../reducers/api/userApiSlice'
import { useSearchMutation } from '../../reducers/api/peopleApiSlice'
import { imgToDataUrl } from '../../utils/helper'

function Search() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { file } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends)

  const [errMsg, setErrMsg] = useState('')

  const [updateUser] = useUpdateUserMutation()
  const [search] = useSearchMutation()

  const dispatch = useDispatch()

  const container = 'people'
  const [currentResults, setCurrentResults] = useState([])

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

  const handleSearch = async (event) => {
    event.preventDefault()
    const searchKeywords = event.target.search.value
    const data = await search({
      searchKeywords,
    })
    if (data.error) {
      setErrMsg('Search Failed')
    } else {
      const results = data.data
      setCurrentResults(results
        .filter((user) => user.username !== username)
        .map((user) => ({
          ...user,
          picture: user.picture
            ? imgToDataUrl(user.picture)
            : null,
        })))
    }
  }

  const handleAdd = async (personId) => {
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
      friends: friends.map((friend) => friend.id).concat(personId),
    })
    if (data.error) {
      setErrMsg('Failed to add friend')
    } else {
      const updatedUser = data.data
      const updatedFriends = updatedUser.friends

      /* Find the friend that is in updatedFriends but not in curren user friends */
      const newFriend = updatedFriends.find(
        (friend) => !friends.some((f) => f.id === friend.id),
      )
      dispatch(appendFriend({
        ...newFriend,
        picture: newFriend.picture ? imgToDataUrl(newFriend.picture) : null,
      }))
    }
  }

  return (
    <div id="search" className="container main">
      <SearchBox searchHandler={handleSearch} container={container} />
      <SearchResults
        results={currentResults}
        container={container}
        modalTitle="Confirm Friend Request"
        getModalText={(name) => `Are you sure you want to add ${name} to your friends list ?`}
        confirmButtonText="Add"
        formHandler={handleAdd}
      />
    </div>
  )
}

export default Search
