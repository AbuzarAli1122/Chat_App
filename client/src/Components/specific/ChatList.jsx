import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList =  ({w='100%', chats=[],chatId,onlineUsers=[],newMessagesAlert=[{
    chatId:'',
    count:0,
}],handleDeleteChat,avatar}) => {
  return (
    <>
      <Stack width={w} direction={'column'} overflow={'auto'} height={'100%'}>
    {
        chats?.map((data,index) => {

            const {_id,name,groupChat,members,avatar  } = data;
            const newMessageAlert= newMessagesAlert.find(item=>
                item.chatId === _id
                );
            const isOnline = members.some((member)=> onlineUsers.includes(_id))

            return <ChatItem newMesageAlert={newMessageAlert} avatar={avatar} isOnline={isOnline}  name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatId===_id} 
            handleDeleteChat={handleDeleteChat}
            index={index} />
        })
    }
      </Stack>
    </>
  )
}

export default ChatList
