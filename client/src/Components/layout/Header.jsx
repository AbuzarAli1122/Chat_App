import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { orange } from '../../constants/color'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import {useDispatch, useSelector} from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import {  resetNotificationCount } from '../../redux/reducers/chat'


const SearchDialog = lazy(()=> import('../specific/Search'))
const NotificationDialog = lazy(()=> import('../specific/Notifications'))   
const NewGroupDialog = lazy(()=> import('../specific/NewGroup')) 

const   Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {isSearch, isNotification,isNewGroup} = useSelector(state => state.misc)
    const {notificationCount} = useSelector(state => state.chat)


    const handleMobile = () => dispatch(setIsMobile(true));

    const openSearchDialog = () => dispatch(setIsSearch(true))
    const openNewGroup = () => {
       dispatch(setIsNewGroup(true))
        }
    const openNotification = () => {
        dispatch(setIsNotification(true));
        dispatch(resetNotificationCount());
    }


    const navigateToGroup = () => {
        navigate('/groups');
        }
    const logouthandler = async() => {
        try {
        const { data } = await axios.get(`${server}/api/v1/user/logout`,{withCredentials:true})

        dispatch(userNotExists())
        toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Somehing went wrong")
        }
        }
  return (
    <>
      <Box height={'4rem'}
      sx={{
        flexGrow:1,
      }}
      >
        <AppBar position='static'
        sx={{
            bgcolor:orange,
        }}
        >
            <Toolbar>
                <Typography variant='h6'
                sx={{
                    display: { xs: 'none', sm: 'block' },
                }}
                >
                    Chat_Hub
                </Typography>

                <Box
                sx={{
                    display: { xs: 'block', sm: 'none' },
                }}
                >
                    <IconButton color='inherit' onClick={handleMobile}>
                        <MenuIcon/>
                    </IconButton>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                }}/>
                <Box>

                    <Iconbtn icon={<SearchIcon />} title={"Search"} onClick={openSearchDialog} />
                    <Iconbtn icon={<AddIcon />} title={"New Group"} onClick={openNewGroup} />
                    <Iconbtn icon={<GroupIcon />} title={"Manage Group"} onClick={navigateToGroup} />
                    <Iconbtn icon={<NotificationsIcon />} title={"Notifications"} onClick={openNotification} value={notificationCount} />
                    <Iconbtn icon={<LogoutIcon />} title={"Logout"} onClick={logouthandler} />

                </Box>


            </Toolbar>
        </AppBar>
      </Box>

      {
        isSearch &&(
            <Suspense fallback={ <Backdrop open /> }>
                <SearchDialog/>
            </Suspense>
        )
      }

       {
        isNotification &&(
            <Suspense fallback={ <Backdrop open /> }>
                <NotificationDialog/>
            </Suspense>
        )
      }

       {
        isNewGroup &&(
            <Suspense fallback={ <Backdrop open /> }>
                <NewGroupDialog/>
            </Suspense>
        )
      }
    </>
  )
}

const Iconbtn = ({icon, title, onClick,value}) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
               
               <Badge
          badgeContent={value}
          color="error"
          invisible={value === 0}  
        >
          {icon}
        </Badge>
            
            </IconButton>
        </Tooltip>
    )
}

export default Header
