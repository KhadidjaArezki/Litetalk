import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCurrentId,
  selectCurrentUsername,
  selectCurrentEmail,
  selectCurrentPicture,
  selectCurrentFriends,
  appendFriend,
} from '../../reducers/authReducer'
import SearchBox from '../searchbox/SearchBox'
import SearchResults from '../search_results/SearchResults'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import { useUpdateUserMutation } from '../../reducers/api/userApiSlice'
import peopleService from '../../services/people'

function Search() {
  const id = useSelector(selectCurrentId)
  const username = useSelector(selectCurrentUsername)
  const email = useSelector(selectCurrentEmail)
  const { isDefault, picture } = useSelector(selectCurrentPicture)
  const friends = useSelector(selectCurrentFriends)

  const [updateUser] = useUpdateUserMutation()

  const dispatch = useDispatch()

  const container = 'people'
  const [currentResults, setCurrentResults] = useState([])

  const handleSearch = async (event) => {
    event.preventDefault()
    const searchKeywords = event.target.search.value
    const results = await peopleService.search({
      searchKeywords,
    })
    setCurrentResults(results.filter((user) => user.username !== username))
  }

  const handleAdd = async (personId) => {
    const updatedUser = await updateUser({
      id,
      username,
      email,
      picture: isDefault ? null : picture,
      friends: friends.map((friend) => friend.id).concat(personId),
    }).unwrap()
    const updatedFriends = updatedUser.friends

    /* Find the friend that is in updatedFriends but not in curren user friends */
    const newFriend = updatedFriends.find(
      (friend) => !friends.some((f) => f.id === friend.id),
    )
    dispatch(appendFriend(newFriend))
  }

  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  )
}

export default Search
