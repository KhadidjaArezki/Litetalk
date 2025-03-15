import { createSlice } from "@reduxjs/toolkit"

const createCookieInHour = (cookieName, cookieValue, hourToExpire) => {
    let date = new Date();
    date.setTime(date.getTime()+(hourToExpire*60*60*1000));
    document.cookie = cookieName + " = " + cookieValue + "; expires = " +date.toGMTString();
}

const storedUserData = () => {
  const cookie = document.cookie.split(';')
  const storedId = cookie[0]?.split('=')[1]
  const storedUserName = cookie[1]?.split('=')[1]
  const storedEmail = cookie[2]?.split('=')[1]
  const storedFriends = cookie[3]?.split('=')[1]
  const storedUserToken = cookie[4]?.split('=')[1]
  console.log('cookie : ', storedUserName + '\n' + storedUserToken)
  return [ storedId, storedUserName, storedEmail, storedFriends, storedUserToken ]
}
const [ storedId, storedUserName, storedEmail, storedFriends, storedUserToken ] = storedUserData()

const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: storedId || null,
    user: storedUserName || null,
    email: storedEmail || null,
    friends: storedFriends || null,
    token: storedUserToken || null,
    isOnline: true
  },
  reducers: {
    setCredentials: (state, action) => {
      const { id, username, email, contacts, token } = action.payload
      state.id = id
      state.user = username
      state.email = email
      state.friends = contacts
      state.token = token
      state.isOnline = true
      createCookieInHour('id', id, 12);
      createCookieInHour('username', username, 12);
      createCookieInHour('email', email, 12);
      createCookieInHour('friends', contacts, 12);
      createCookieInHour('token', token, 12);
    },
    resetCredentials: (state, _) => {
      state.id = null
      state.user = null
      state.email = null
      state.friends = null
      state.token = null
      state.isOnline = false
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })
    }
  }
})
export const { setCredentials, resetCredentials } = authSlice.actions
export default authSlice.reducer

export const selectCurrentId = (state) => state.auth.id
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentEmail = (state) => state.auth.email
export const selectCurrentFriends = (state) => state.auth.friends
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentConnectionStatus = (state) => state.auth.isOnline
