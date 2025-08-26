import { Box, Typography } from '@mui/material'
import React, { memo } from 'react'
import { lightBlue } from '../../constants/color'
import moment from 'moment'
import { fileFormat } from '../../lib/features'
import RenderAttachments from './RenderAttachments'

const MessageComponent = ({message,user}) => {

    const {sender,content,attachments=[],createdAt} = message;

   if (!user || !sender) return null;

    const senderId = typeof sender === "object" ? sender._id : sender;
    const sameSender = String(senderId) === String(user?._id);


    const timeAgo = moment(createdAt).fromNow();

  return (
    <div 
    style={{
        alignSelf:sameSender ? "flex-end" : "flex-start",
        backgroundColor:'white',
        color:'black',
        borderRadius:'5px',
        padding:'0.5rem',
        width:'fit-content'
    }}>
      
      { !sameSender && <Typography color={lightBlue} fontWeight={'600'} variant='caption'>{sender.name}</Typography> }
      { content && <Typography>{content}</Typography> }
      
    {
        attachments.length > 0 && 
        attachments.map((attachment,index)=>  {

            const url = attachment.url || attachment.secure_url || attachment.path;
            const file = fileFormat(url);

            return <Box key={index}>
                <a href={url} target='_blank' download style={{ color:'black'}}>
                    { RenderAttachments(file,url)}
                </a>
            </Box>
        })
    }

      <Typography variant='caption' color={'text.secondary'}>{timeAgo}</Typography>
    </div>
  )
}

export default memo(MessageComponent)
