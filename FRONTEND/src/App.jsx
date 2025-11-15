
import React from 'react'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ChatPage from './pages/ChatPage'
import { useAuthStore } from './store/useAuthStore'
function App() {
  const {authUser,count,login}=useAuthStore();
  console.log("authUser",authUser);
  console.log("isloading",count);
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[linear-gradient(135deg,_white_0%,_white_50%,_rgb(0,102,255)_50%,_rgb(0,102,255)_100%)]

"
    >
      <button onClick={login} className="z-10">Login</button>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
