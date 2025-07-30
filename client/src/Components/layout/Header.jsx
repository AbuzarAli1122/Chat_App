import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/color'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'

import { useNavigate } from 'react-router-dom'

const SearchDialog = lazy(()=> import('../specific/Search'))
const NotificationDialog = lazy(()=> import('../specific/Notifications'))   
const NewGroupDialog = lazy(()=> import('../specific/NewGroup')) 

const   Header = () => {

    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [isNotification,setIsNotification] = useState(false);

    const handleMobile = () => {
        setIsMobile(prev=>!prev)
    }
    const openSearchDialog = () => {
        setIsSearch(prev=>!prev)
        }
    const openNewGroup = () => {
        setIsNewGroup(prev=>
            !prev
            )
        }
    const openNotification = () =>
        {
            setIsNotification(prev=>
                !prev
                )
                }
    const navigateToGroup = () => {
        navigate('/groups');
        }
    const logouthandler = () => {
        console.log('Logout Clicked');
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
                    <Iconbtn icon={<NotificationsIcon />} title={"Notifications"} onClick={openNotification} />
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

const Iconbtn = ({icon, title, onClick}) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header
