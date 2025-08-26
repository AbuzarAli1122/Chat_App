import  { useCallback, useMemo, useRef, useState } from 'react'
import AppLayout from '../Components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { grayColor, orange } from '../constants/color'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { InputBox } from '../Components/styles/StyledComponent'
import FileMenu from '../Components/dialogs/FileMenu'
import MessageComponent from '../Components/shared/MessageComponent'
import { getSocket } from '../socket'
import { NEW_MESSAGE } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import {useInfiniteScrollTop} from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc'


const Chat = ({chatId, user}) => {

  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);



  const chatDetailsData = useChatDetailsQuery(
    {chatId}, 
    { skip: !chatId }
  );

  const oldMessagesChunk = useGetMessagesQuery({
    chatId,
    page
  })

  const {data: oldMessages,setData: setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages,
  )

  const errors = [
    {isError: chatDetailsData.isError, error: chatDetailsData.error},
    {isError: oldMessagesChunk.isError, error: oldMessagesChunk.error}
  ];

  const members = chatDetailsData?.chat?.members || [];

  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    // Emitting message to server
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage('')
  };


const newMessagesHandler = useCallback((data) => {
   console.log("📩 Received NEW_MESSAGE:", data);
   setMessages((prev) => [...prev, data.message]);
}, []);


const eventHandler = useMemo(() => ({
  [NEW_MESSAGE]: newMessagesHandler
}), [newMessagesHandler]);
  
  useSocketEvents(socket,eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  const handleFileMenuOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  return chatDetailsData.isLoading  ?( 
  <Skeleton/>
  ) : (
   <>
   <Stack 
   ref={containerRef}
   boxSizing={'border-box'}
   padding={'1rem'}
   spacing={'1rem'}
   bgcolor={grayColor}
   height={'90%'}
   sx={{ overflowY: 'auto', overflowX:'hidden' }}
   >

{ allMessages.map(i =>(
  <MessageComponent key={i._id || Math.random()} message={i} user={user} />
))}
   </Stack>

   <form style={{
    height:'10%'
   }}
   onSubmit={submitHandler}
   >
    <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'}>

      <IconButton
      sx={{
        position: 'absolute',
        left: '1.5rem',
        rotate:'30deg',
      }}
      onClick={handleFileMenuOpen}
      >
        <AttachFileIcon/>
      </IconButton>

      <InputBox placeholder='Type Message Here .....' value={message}
      onChange={e => setMessage(e.target.value)}
      />

      <IconButton type='submit'
      sx={{
        backgroundColor: orange,
        color: 'white',
        marginLeft:'1rem',
        padding:'0.5rem',
        "&:hover":{
          bgcolor:'error.dark',
          rotate:'-40deg'
        }
      }}
      >
        <SendIcon/>
      </IconButton>

    </Stack>
   </form>
   <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}   />
   </>
  )
}

export default AppLayout()(Chat)

