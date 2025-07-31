import { Avatar, Backdrop, Box, Button, ButtonGroup, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import {Add as AddIcon, Delete as DeleteIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon} from '@mui/icons-material'
import { matBlack } from '../constants/color';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { lazy, memo, Suspense, useEffect, useState } from 'react';

import {Link} from '../Components/styles/StyledComponent'
import AvatarCard from '../Components/shared/AvatarCard';
import {sampleChats, sampleUsers} from '../constants/sampleData'
import {Edit as EditIcon} from '@mui/icons-material';
import {Done as DoneIcon} from '@mui/icons-material';
import UserItem from '../Components/shared/UserItem';
const ConfirmDeleteDialog = lazy(()=> import('../Components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(()=> import('../Components/dialogs/AddMemberDialog'))



const isAddMember = false
const Group = () => {


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName,setGroupName] = useState('')
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState('')
  const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false)


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

const openConfirmDeleteHandler = ()=>{
  setConfirmDeleteDialog(true)
};

const closeConfirmDeleteHandler = ()=>{
  setConfirmDeleteDialog(false)
}
const openAddMember = ()=>{};

const deleteHandler = ()=>{
  closeConfirmDeleteHandler()
};

const removeMemberHandler = (id)=>{
  console.log('remove id:',id)
};

useEffect(()=>{
  if(chatId){

    setGroupName(`Group name ${chatId}`)
    setGroupNameUpdatedValue(`Group name ${chatId}`)
  }
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
  position:'absolute',
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

      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'} padding={'2rem'} mt={6}>
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
        <Typography variant='h4' fontSize={{xs:'1.5rem',sm:'2rem'}} >{groupName}</Typography>
        <IconButton onClick={()=> setIsEdit(true)}>
        <EditIcon/>
        </IconButton>
        </>
      }
      </Stack>
    
  </>;

  const ButtonGroup = <Stack
  direction={{
    xs: 'column-reverse',
    sm: 'row',
  }}
  spacing={'1rem'}
  p={{
    xs: '0',
    sm: '1rem',
    md: '1rem 4rem'
  }}
  >
  
<Button size='large' variant='outlined' color='error' startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler}>Delete Group</Button>
<Button size='large' variant='contained' startIcon={<AddIcon/>} onClick={openAddMember}>Add Member</Button>

  </Stack>


  return (
    <Grid container height={'100vh'}>

      <Grid item size={{sm:4}}
      sx={{
        display:{xs:'none',sm:'block'},
        bgcolor:'bisque',
      
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
        <Typography
        margin={'2rem'}
        alignSelf={'center'}
        variant='h5'

        >Members</Typography>

        <Stack
        maxWidth={'45rem'}
        width={'100%'}
        boxSizing={'border-box'}
        padding={{
          sm: '1rem',
          xs:'0',
          md: '2rem 4rem'
        }}
        spacing={{xs:'1rem',sm:'2rem'}}
        // bgcolor={'bisque'}
        height={{xs:'40vh',sm:'50vh'}}
        overflow={'auto'}
        >
          {
            sampleUsers.map((i)=>(
              <UserItem key={i._id} user={i} isAdded handler={removeMemberHandler}
              styling={{
                boxShadow : '0 0 0.5rem rgba(0,0,0,0.2)',
                padding:'1rem 2rem',
                borderRadius:'1rem'
              }}
              />
            ))
          }
        </Stack>

          {ButtonGroup}

        </>
        }
      </Grid>

{
  isAddMember && (
    <Suspense fallback={<Backdrop open />}>
      <AddMemberDialog/>
    </Suspense>
  )
}

{
  confirmDeleteDialog && 
  (<Suspense fallback={<Backdrop open />}>
    <ConfirmDeleteDialog 
    open={confirmDeleteDialog} 
    handleClose={closeConfirmDeleteHandler}
    deleteHandler={deleteHandler}
    />
  </Suspense>)
}

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
  height="100vh"
    overflow="auto"
    sx={{
      padding: '1rem',
      boxSizing: 'border-box',
    }}
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
