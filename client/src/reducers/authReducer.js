/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'
import defaultPicture from '../icons/default-user-profile-image.png'
import {
  createCookieInHour,
  resetCookie,
  getCookieValue,
} from '../utils/cookieParser'
import { imgToDataUrl } from '../utils/helper'
import { getProfilePicture } from '../utils/IndexedDB'

const cookieLifeInHours = process.env.REACT_APP_COOKIE_LIFE_IN_HOURS

const storedUserData = () => {
  const storedId = getCookieValue(0)
  const storedUserName = getCookieValue(1)
  const storedEmail = getCookieValue(2)
  const storedUserToken = getCookieValue(3)
  return [storedId, storedUserName, storedEmail, storedUserToken]
}
const [
  storedId, storedUserName, storedEmail, storedUserToken,
] = storedUserData()

const storedPictureMeta = localStorage.getItem('user_profile_picture')
  ? JSON.parse(localStorage.getItem('user_profile_picture'))
  : { isDefault: true, picture: defaultPicture }

const storedPictureFile = (async () => {
  const result = await getProfilePicture()
  // console.log('Stored profile picture: ', result)
  return result
})()

const storedFriends = localStorage.getItem('friends')
  ? JSON.parse(localStorage.getItem('friends'))
  : null

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: storedId ?? null,
    username: storedUserName ?? null,
    email: storedEmail ?? null,
    picture: {
      ...storedPictureMeta,
      file: storedPictureFile ?? null,
    },
    friends: storedFriends ?? null,
    token: storedUserToken ?? null,
    isOnline: true,
  },
  reducers: {
    setCredentials: (state, action) => {
      const {
        id, username, email, picture, friends, token,
      } = action.payload
      state.id = id
      state.username = username
      state.email = email
      state.picture = picture?.picture
        ? picture
        : {
          isDefault: !picture,
          file: picture ?? null,
          picture: picture ? imgToDataUrl(picture) : defaultPicture,
        }
      state.friends = friends
      state.token = token
      state.isOnline = true
      createCookieInHour('id', id, cookieLifeInHours)
      createCookieInHour('username', username, cookieLifeInHours)
      createCookieInHour('email', email, cookieLifeInHours)
      createCookieInHour('token', token, cookieLifeInHours)
      localStorage.setItem('user_profile_picture', JSON.stringify({
        isDefault: state.picture.isDefault,
        picture: state.picture.picture,
      }))
      localStorage.setItem('friends', JSON.stringify(friends))
    },
    // eslint-disable-next-line no-unused-vars
    resetCredentials: (state, _) => {
      state.id = null
      state.username = null
      state.email = null
      state.picture = null
      state.friends = null
      state.token = null
      state.isOnline = false
      document.cookie.split(';').forEach((c) => {
        document.cookie = resetCookie(c)
      })
      localStorage.clear()
    },
    appendFriend: (state, action) => {
      const newFriends = state.friends.concat(action.payload)
      state.friends = newFriends
      localStorage.setItem('friends', JSON.stringify(newFriends))
    },
    removeFriend: (state, action) => {
      const newFriends = state.friends.filter((f) => f.id !== action.payload)
      state.friends = newFriends
      localStorage.setItem('friends', JSON.stringify(newFriends))
    },
    updateProfile: (state, action) => {
      const {
        username, email, picture,
      } = action.payload
      state.username = username
      state.email = email
      state.picture = {
        isDefault: !picture,
        file: picture ?? null,
        picture: picture ? imgToDataUrl(picture) : defaultPicture,
      }
      document.cookie.split(';').forEach((c) => {
        document.cookie = resetCookie(c)
      })
      createCookieInHour('id', state.id, cookieLifeInHours)
      createCookieInHour('username', username, cookieLifeInHours)
      createCookieInHour('email', email, cookieLifeInHours)
      createCookieInHour('token', state.token, cookieLifeInHours)
      localStorage.setItem('user_profile_picture', JSON.stringify({
        isDefault: state.picture.isDefault,
        picture: state.picture.picture,
      }))
    },
    setProfilePictureFile: (state, action) => {
      if (state.picture) {
        state.picture.file = action.payload ?? null
      }
    },
  },
})
export const {
  setCredentials,
  resetCredentials,
  appendFriend,
  removeFriend,
  updateProfile,
  setProfilePictureFile,
} = authSlice.actions
export default authSlice.reducer

export const selectCurrentId = (state) => state.auth.id
export const selectCurrentUsername = (state) => state.auth.username
export const selectCurrentEmail = (state) => state.auth.email
export const selectCurrentPicture = (state) => state.auth.picture
export const selectCurrentFriends = (state) => state.auth.friends
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentConnectionStatus = (state) => state.auth.isOnline
