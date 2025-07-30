
import React, { memo } from 'react'
import { Link } from '../styles/StyledComponent'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'

const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat=false,
    sameSender,
    isOnline,
    newMesageAlert,
    index=0,
    handleDeleteChat,
}) => {
  return <Link sx={{padding:0}} to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChat(e, _id,groupChat)}>
    <div style={{
        display: 'flex',
        alignItems: 'center',
        padding:'1rem',
        backgroundColor: sameSender ? 'black':'unset',
        color: sameSender ? 'white':'unset',
        gap:'1rem',
        position:'relative'
    }}>

    <AvatarCard avatar={avatar}/>
    
    <Stack>
        <Typography>
            {name}
        </Typography>
        {
            newMesageAlert && (
                <Typography>{newMesageAlert.count} New Message</Typography>
            )
        }
    </Stack>

    {
        isOnline && <Box
        />
    }
    </div>
  </Link>
}

export default memo(ChatItem)
