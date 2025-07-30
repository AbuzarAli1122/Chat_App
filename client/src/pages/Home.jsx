import React from 'react'
import AppLayout from '../Components/layout/AppLayout'
import { Typography } from '@mui/material'

const Home = () => {
  return (
    <Typography p={'2rem'} variant='h5' textAlign={'center'}>
      Select a Friend to Chat
    </Typography>
  )
}

export default AppLayout()(Home)
