import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Chats from './components/chats/Chats'
import ChatRoom from './components/chatroom/ChatRoom'
import Signup from './components/signup/Signup'
import Search from './components/search/Search'
import Profile from './components/profile/Profile'
import Friends from './components/friends/Friends'
import EditProfilePage from './components/profile/EditProfilePage'
import RequireAuth from './components/require_auth/RequireAuth'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="signup" element={<Signup />} />
          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="search" element={<Search />} />
            <Route exact path="/" element={<Chats />} />
            <Route exact path="chats" element={<Chats />} />
            <Route exact path="chatroom" element={<ChatRoom />} />
            <Route exact path="profile" element={<Profile />} />
            <Route exact path="edit" element={<EditProfilePage />} />
            <Route exact path="friends" element={<Friends />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
