import React,{lazy, Suspense} from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import ProtectRoute from './Components/auth/ProtectRoute.jsx'
import { LayoutLoader } from './Components/layout/Loaders.jsx'


const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Chat = lazy(() => import('./pages/Chat.jsx'))
const Groups = lazy(() => import('./pages/Group.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const AdminLogin = lazy(()=> import('../src/pages/admin/AdminLogin.jsx'))
const DashBoard = lazy(()=> import('../src/pages/admin/DashBoard.jsx'))


let user= true;

const App = () => {
  return (
    <>
    <Router>
<Suspense fallback={<LayoutLoader/>}>
  <Routes>
  <Route element={<ProtectRoute user={user}/>}>


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

  <Route path="*" element={<NotFound/>} />

</Routes>
</Suspense>
    </Router>
      
    </>
  )
}

export default App
