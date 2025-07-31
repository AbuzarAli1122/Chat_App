import { Avatar, Box, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import {KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon} from '@mui/icons-material'
import { matBlack } from '../constants/color';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';

import {Link} from '../Components/styles/StyledComponent'
import AvatarCard from '../Components/shared/AvatarCard';
import {sampleChats} from '../constants/sampleData'
import {Edit as EditIcon} from '@mui/icons-material';
import {Done as DoneIcon} from '@mui/icons-material';


const Group = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName,setGroupName] = useState('')
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState('')



  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('group');
  
  const navigate = useNavigate()
  const navigateBack =()=>{
    navigate('/')
  };

const handleMobile = ()=>{
  setIsMobileMenuOpen(prev => !prev)
};

const handleMobileClose = ()=>{
  setIsMobileMenuOpen(false)
}

const updateGroupName = ()=>{
  setIsEdit(false)
}

useEffect(()=>{
  setGroupName(`Group name ${chatId}`)
  setGroupNameUpdatedValue(`Group name ${chatId}`)
  return()=>{
    setGroupName('')
    setGroupNameUpdatedValue('')
    setIsEdit(false)
  }
},[chatId])

  const IconBtns = <>

<Box
 sx={{
  display:{xs:'block',sm:'none'},
  position:'fixed',
  right:'1rem',
  top:'2rem',
 
 }}
>

   <IconButton sx={{ 
  bgcolor:matBlack,
  color:'white',
  '&:hover':{bgcolor:'bisque',color:matBlack},

  }} onClick={handleMobile} >
  <MenuIcon/>
 </IconButton>

</Box>
  
  <Tooltip title='back'>
    <IconButton
    sx={{
      position:'absolute',
      top:'2rem',
      left:'2rem',
      bgcolor:matBlack,
      color:'white',
      '&:hover':{
        bgcolor:'bisque',
        color:matBlack
      }
    }}
    onClick={navigateBack}
    >
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>
  </>;

const GroupName = <>

      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'} padding={'3rem'}>
      {
        isEdit ?  
        <>
        <TextField value={groupNameUpdatedValue} onChange={e=>setGroupNameUpdatedValue(e.target.value)}/>
        <IconButton onClick={updateGroupName}>
          <DoneIcon/>
        </IconButton>
        </>
        : 
        <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton onClick={()=> setIsEdit(true)}>
        <EditIcon/>
        </IconButton>
        </>
      }
      </Stack>
    
  </>;


  return (
    <Grid container height={'100vh'}>

      <Grid item size={{sm:4}}
      sx={{
        display:{xs:'none',sm:'block'},
        bgcolor:'bisque'
      }}
      >
        <GroupList myGroups={sampleChats} chatId={chatId}/>

      </Grid>

      <Grid item size={{xs:12,sm:8}}
      sx={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        position:'relative',
        padding:'1rem 3rem'
      }}
      >
        {IconBtns}
        {
          groupName &&
        <>
        {GroupName}
        
        </>
        }
      </Grid>

      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose}
      sx={{
        display:{xs:'block',sm:'none'}
      }}
      > 
      <GroupList w={'70vw'} myGroups={sampleChats} chatId={chatId}/>
      </Drawer>

    </Grid>
  )
}

const GroupList = ({w='100%',myGroups=[],chatId})=>(
  <Stack 
  width={w}
  >
    {
      myGroups.length > 0 ? myGroups.map((group)=> <GroupListItem group={group} chatId={chatId} key={group._id} />) : <Typography textAlign={'center'} padding={'1rem'}>No Groups</Typography>
    }
  </Stack>
);

const GroupListItem = memo(({group,chatId})=>{
  const {_id, name, avatar} = group;

  return <Link to={`?group=${_id}`} onClick={e => {
    if(chatId === _id){
      e.preventDefault();
    }
    }}>
  
  <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
    <AvatarCard avatar={avatar}/>
    <Typography variant={'h6'}>{name}</Typography>
  </Stack>

  </Link>
})

export default Group
