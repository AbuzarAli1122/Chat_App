import React,{lazy, Suspense, useEffect} from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import ProtectRoute from './Components/auth/ProtectRoute.jsx'
import { LayoutLoader } from './Components/layout/Loaders.jsx'
import axios from 'axios'
import { server } from './constants/config.js'
import {useDispatch, useSelector} from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth.js'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './socket.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Chat = lazy(() => import('./pages/Chat.jsx'))
const Groups = lazy(() => import('./pages/Group.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const AdminLogin = lazy(()=> import('../src/pages/admin/AdminLogin.jsx'))
const DashBoard = lazy(()=> import('../src/pages/admin/DashBoard.jsx'))
const UserManagement = lazy(()=> import('../src/pages/admin/UserManagement.jsx'))
const MessageManagement = lazy(()=> import('../src/pages/admin/MessageManagement.jsx'))
const ChatManagement = lazy(()=> import('../src/pages/admin/ChatManagement.jsx'))


const App = () => {

  const dispatch = useDispatch();
  const {user,loader} = useSelector(state => state.auth )

useEffect(()=>{
  
  axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
  .then(({data})=> dispatch(userExists(data.user)))
  .catch((err)=> dispatch(userNotExists()))

},[dispatch])


  return loader? <LayoutLoader/> : (
    <>
    <Router>
<Suspense fallback={<LayoutLoader/>}>
  <Routes>

  <Route element={
  <SocketProvider>
    <ProtectRoute user={user}/>
  </SocketProvider>
}>

  <Route path="/" element={<Home/>} />
   <Route path="/chat/:chatId" element={<Chat/>} />
  <Route path="/groups" element={<Groups/>} />

  </Route>
    
  <Route path="/login" element={
    <ProtectRoute user={!user} redirect='/'>
      <Login/>
    </ProtectRoute>
    } />
 
  <Route path='/admin' element={<AdminLogin/>}/>
  <Route path='/admin/dashboard' element={<DashBoard/>}/>

    <Route path='/admin/users' element={<UserManagement/>}/>
  <Route path='/admin/chats' element={<ChatManagement/>}/>
  <Route path='/admin/messages' element={<MessageManagement/>}/>


  <Route path="*" element={<NotFound/>} />

</Routes>
</Suspense>
<Toaster position='bottom-center'/>
    </Router>
      
    </>
  )
}

export default App
