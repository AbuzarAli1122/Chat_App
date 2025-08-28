import  { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppLayout from '../Components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { grayColor, orange } from '../constants/color'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { InputBox } from '../Components/styles/StyledComponent'
import FileMenu from '../Components/dialogs/FileMenu'
import MessageComponent from '../Components/shared/MessageComponent'
import { getSocket } from '../socket'
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events'
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import {useInfiniteScrollTop} from '6pp'
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc'
import { removeNewMessagesAlert } from '../redux/reducers/chat'
import { TypingLoader } from '../Components/layout/Loaders'


const Chat = ({chatId, user}) => {

  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);

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

  const members = chatDetailsData?.data?.chat?.members || [];

  const messageChangeHandler = (e) => {
    setMessage(e.target.value); 
    if(!IamTyping){
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true);
    }

    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
     
   typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING,{members,chatId});
      setIamTyping(false);
    },[2000]);

  };

  const submitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    // Emitting message to server
    socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage('')
  };

  useEffect(()=>{
    
    dispatch(removeNewMessagesAlert(chatId));

    return ()=>{
      setMessages([]);
      setMessage('');
      setOldMessages([]);
      setPage(1);
    }
  }, [chatId]);

  useEffect(() => {
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({behavior:'smooth'})
    }
  },[messages])

const newMessagesListener = useCallback((data) => {
   if(data.chatId !== chatId) return;
   setMessages((prev) => [...prev, data.message]);
}, [chatId]);

const startTypingListener = useCallback((data) => {
   if(data.chatId !== chatId) return;
    setUserIsTyping(true);
}, [chatId]);

const stopTypingListener = useCallback((data) => {
   if(data.chatId !== chatId) return;
    setUserIsTyping(false);
}, [chatId]);

const alertListener = useCallback(
  (content) => {
    const messageForRealTime = {
              content,
              sender:{
                  _id:'aasdasasccascasc',
                  name:'Admin'
              },
              chat:chatId,
              createdAt: new Date().toISOString()
          };
    setMessages((prev) => [...prev, messageForRealTime]);
}, [chatId]);

const eventHandler = useMemo(() => ({
  [NEW_MESSAGE]: newMessagesListener,
  [START_TYPING]: startTypingListener,
  [STOP_TYPING]: stopTypingListener,
  [ALERT]: alertListener,


}), [newMessagesListener,startTypingListener]);
  
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

{ userIsTyping && <TypingLoader/> }
<div ref={bottomRef}/>
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
      onChange={messageChangeHandler}
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

