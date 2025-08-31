import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { setIsAddMember } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({chatId}) => {


  const [selectedMembers,setSelectedMembers] = useState([])

  const dispatch = useDispatch();
  const { isAddMember } = useSelector(state => state.misc)
  const {isLoading,data,isError,error} = useAvailableFriendsQuery(chatId);
  const [ addMember , isLoadingAddMembers ] = useAsyncMutation(useAddGroupMembersMutation)

  useErrors( [{ isError, error }])
  const selectMemberHandler = (id)=>{

    setSelectedMembers((prev)=> (prev.includes(id) ? prev.filter((currElement) => currElement!==id) :[...prev,id]))
  }
 
    const addMemberSubmitHandler = ()=>{
      addMember('Adding Members...',{chatId,members:selectedMembers})
        closeHandler()
    };
    const closeHandler =()=>{     
        dispatch(setIsAddMember(false))
    }
  return (
    <Dialog open={isAddMember} onClose={closeHandler}   >

      <Stack spacing={'2rem'} width={'20rem'} p={'2rem'}>
        <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
      </Stack>

      <Stack spacing={'0.5rem'}>
        { isLoading? <Skeleton/> : data?.availableFriends?.length >0 ?  (data?.availableFriends?.map((i)=>(
            <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
        ))) : <Typography textAlign={'center'}>No Friends</Typography>
    }
      </Stack>

       <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'} mt={4} mb={4} >

         <Button color='error' onClick={closeHandler}>Cancel</Button>
        <Button variant='contained' disabled={isLoadingAddMembers} onClick={addMemberSubmitHandler}>Add</Button>

       </Stack>


    </Dialog>
  )
}

export default AddMemberDialog
