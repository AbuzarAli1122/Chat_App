import { Drawer, Grid, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { useMyChatsQuery } from '../../redux/api/api';
import { setIsMobile } from '../../redux/reducers/misc';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from './Header';
import { getSocket } from '../../socket';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events';
import { useCallback, useEffect } from 'react';
import { incrementNotificationCount, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSavedFromStorage } from '../../lib/features';

const AppLayout = () => WrappedComponent => {

  return props => {

    const params = useParams();
    const chatId = params.chatId;

    const socket = getSocket()
    const dispatch = useDispatch();
    const {isMobile} = useSelector(state => state.misc)
    const {user} = useSelector(state => state.auth);
    const {newMessagesAlert} = useSelector(state => state.chat)

    const {isLoading,data,isError,error,refetch} = useMyChatsQuery('');
   useErrors([{isError,error}]);

    useEffect(() => {
      getOrSavedFromStorage({key:NEW_MESSAGE_ALERT, value:newMessagesAlert})
    },[newMessagesAlert])

    const handleDeleteChat = (e,_id , groupChat)=>{
      e.preventDefault();
      console.log(_id,groupChat);

    }
    const handleMobileClose = ()=> dispatch(setIsMobile(false))

const newMessagesAlertListener= useCallback((data)=>{
  if(data.chatId === chatId) return;
  dispatch(setNewMessagesAlert(data));

},[chatId]);

const newRequestListener = useCallback(()=>{
  dispatch(incrementNotificationCount());
},[dispatch]);

const refetchListener = useCallback((data)=>{
  refetch();
},[refetch]);

const eventHandlers = { 
  [NEW_MESSAGE_ALERT]: newMessagesAlertListener,
  [NEW_REQUEST]: newRequestListener,
  [REFETCH_CHATS]: refetchListener,
 }  

 useSocketEvents(socket,eventHandlers);
    
    return (
      <>
        <Title />
        <Header />

        {
          isLoading ? (<Skeleton/>):
          (
            <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList 
            w='70vw'
            chats={data?.message} 
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessagesAlert}
            /> 
            </Drawer>
          )
        }

        <Grid container height="calc(100vh - 4rem)" columns={12} >
          {/* First Column */}
          <Grid
            item
            size={{xs:0,sm:4,md:3}}
            height="100%"
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
           {
            isLoading ? (<Skeleton/>) 
            :  <ChatList 
            chats={data?.message} 
            chatId={chatId}
            handleDeleteChat={handleDeleteChat}
            newMessagesAlert={newMessagesAlert}
            /> 
           }
          </Grid>

          {/* Middle Content */}
          <Grid
            item
            size={{xs:12,sm:8,md:5}}
            height="100%"
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          {/* Third Column */}
          <Grid
            item
            size={{xs:0,md:4}}
            height="100%"
            sx={{
              display: { xs: 'none', md: 'block' },
              padding: '2rem',
              bgcolor: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            <Profile user={user}/>
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
