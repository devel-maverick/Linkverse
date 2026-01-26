
import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ChatPage from './pages/ChatPage'
import { useAuthStore } from './store/useAuthStore'
import PageLoader from './components/PageLoader'
import { Toaster } from 'react-hot-toast'
function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  // console.log({authUser})
  if (isCheckingAuth) return <PageLoader />
  return (
    <div className="h-screen w-full overflow-hidden bg-base-100">
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster />
    </div>

  )
}

export default App
