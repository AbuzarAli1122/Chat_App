import { Add as AddIcon, Delete as DeleteIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Skeleton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { matBlack } from '../constants/color';

import { Done as DoneIcon, Edit as EditIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutLoader } from '../Components/layout/Loaders';
import AvatarCard from '../Components/shared/AvatarCard';
import UserItem from '../Components/shared/UserItem';
import { Link } from '../Components/styles/StyledComponent';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { setIsAddMember } from '../redux/reducers/misc';
const ConfirmDeleteDialog = lazy(()=> import('../Components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(()=> import('../Components/dialogs/AddMemberDialog'))



const Group = () => {


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [groupName,setGroupName] = useState('')
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState('')
  const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false)
  const [members,setMembers] = useState([])
  const dispatch = useDispatch();
  const { isAddMember } = useSelector(state => state.misc)

  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('group');
  const navigate = useNavigate()

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    {chatId , populate : true},
    { skip: !chatId }
  ); 

  const [updateGroup , isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [ removeMember , isLoadingRemoveMember ] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [ deleteGroup , isLoadingDeleteGroup ] = useAsyncMutation(useDeleteChatMutation)

  const errors = [
    {
    isError: myGroups.isError,
    error: myGroups.error
  },
   {
    isError: groupDetails.isError,
    error: groupDetails.error
  },
]
  useErrors(errors)

  useEffect(()=>{
    const groupData = groupDetails.data;
    if(groupData){
      setGroupName(groupData.chat.name)
      setGroupNameUpdatedValue(groupData.chat.name)
      setMembers(groupData.chat.members )
    }

    return()=>{
      setGroupName('')
      setGroupNameUpdatedValue('')
      setMembers([])
      setIsEdit(false)
    }

  },[groupDetails.data])

  

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
  updateGroup('Updating group name...',{chatId,name:groupNameUpdatedValue})
}

const openConfirmDeleteHandler = ()=>{
  setConfirmDeleteDialog(true)
};

const closeConfirmDeleteHandler = ()=>{
  setConfirmDeleteDialog(false)
}
const openAddMember = ()=>{
  dispatch(setIsAddMember(true))
};

const deleteHandler = ()=>{
  deleteGroup('Deleting group... ',chatId)
  closeConfirmDeleteHandler()
  navigate('/groups')
};

const removeMemberHandler = (id)=>{
  removeMember('Removing member...',{chatId,userId:id})
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

      <Stack 
      direction={'row'} 
      alignItems={'center'} 
      justifyContent={'center'} 
      spacing={'1rem'} 
      padding={'2rem'} 
      mt={6}
      >
      {
        isEdit ?  
        <>
        <TextField 
        value={groupNameUpdatedValue} 
        onChange={e=>setGroupNameUpdatedValue(e.target.value)}
        />
        <IconButton onClick={updateGroupName} disabled={isLoadingGroupName} >
          <DoneIcon/>
        </IconButton>
        </>
        : 
        <>
        <Typography variant='h4' fontSize={{xs:'1.5rem',sm:'2rem'}} >
          {groupName}
        </Typography>
        <IconButton disabled={isLoadingGroupName} onClick={()=> setIsEdit(true)}>
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
    md: '2rem 4rem'
  }}
  >
  
<Button 
sx={{
  size:{sm:'small',md:'large'},
}}
variant='outlined' 
color='error' 
startIcon={<DeleteIcon/>} 
onClick={openConfirmDeleteHandler}
>
  Delete Group
</Button>
<Button 
sx={{
  size:{sm:'small',md:'large'}
}}
// size='large' 
variant='contained' 
startIcon={<AddIcon/>} 
onClick={openAddMember}>
  Add Member
</Button>

  </Stack>


  return myGroups.isLoading ? <LayoutLoader/> :  (
    <Grid container height={'100vh'}>

      <Grid item size={{sm:4}}
      sx={{
        display:{xs:'none',sm:'block'},
        bgcolor:'bisque',
      
      }}
      >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>

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

        >
          Members
          
        </Typography>

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
          { isLoadingRemoveMember ? <CircularProgress/> :
            members.map((i)=>(
              <UserItem 
              key={i._id} 
              user={i} 
              isAdded 
              handler={removeMemberHandler}
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
      <AddMemberDialog chatId={chatId}/>
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
      <GroupList w={'70vw'} myGroups={myGroups?.data?.groups} chatId={chatId}/>
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
      myGroups.length > 0 ? 
      myGroups.map((group)=> 
      <GroupListItem group={group} chatId={chatId} key={group._id} />) 
      : <Typography textAlign={'center'} padding={'1rem'}>No Groups</Typography>
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
