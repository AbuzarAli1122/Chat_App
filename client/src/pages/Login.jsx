import { Avatar, Box, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { VisuallyHiddenInput } from '../Components/styles/StyledComponent';
import {useFileHandler, useInputValidation} from '6pp'
import { usernameValidator } from '../utils/validators';

const Login = () => {

    const [isLogin,setIsLogin]= useState(true);

   const name = useInputValidation('');
    const bio = useInputValidation('');
    const username = useInputValidation('',usernameValidator);
    const password = useInputValidation('');

    const avatar = useFileHandler('single')


const handleSignUp = (e) => {
    e.preventDefault();
}
const handleLogin = (e) =>{
    e.preventDefault();

}
    const toggleLogin = () => {
        setIsLogin(prev => !prev);
    }

  return (
    <>
    <div
    style={{
        backgroundImage:
        'linear-gradient( rgba(200, 200, 200, 0.5), rgba(120, 120, 120, 0.5) )'
    }}>
    <Container component='main' maxWidth='xs'
    sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Paper elevation={3} 
        sx={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: 4}}>

{        isLogin ? (
            <>
            <Typography variant='h5'>Login</Typography>
            <form onSubmit={handleLogin} >
                <TextField required 
                fullWidth 
                label='Username'
                margin='normal'
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
                />
                <TextField required 
                fullWidth 
                label='Pasword'
                type='password'
                margin='normal'
                variant='outlined'
                value={password.value}
                onChange={password.changeHandler}
                />
                
                <Button variant='contained' color='primary' type='submit' fullWidth
                sx={{
                    mt:'1rem'
                }}
                >
                    Login
                </Button>
                <Box sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography sx={{ marginTop: '1rem'}}>
                    OR
                </Typography>
                <Button variant='text' color='primary' onClick={toggleLogin} >
                    Sign Up Instead
                </Button>
                </Box>
            </form>

            </>
            ) : (
            <>
            <Typography variant='h5'>Sign Up</Typography>
            <form onSubmit={handleSignUp} >

                <Stack position={'relative'} width={'10rem'} margin={'1rem auto'}>
                    <Avatar sx={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'contain',
                    }}
                    src={avatar.preview}
                    />

                    <IconButton
                    component='label'
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        color:'white',
                        bgcolor:'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}>
                        <>
                        <CameraAltIcon/>
                        <VisuallyHiddenInput type='file' onChange={avatar.changeHandler}/>
                        </>
                    </IconButton>
                </Stack>

                     { avatar.error && (
                    <Typography width={'fit-content'} display={'block'} margin={'1rem'} color='error' variant='caption'>
                        {avatar.error}
                        </Typography>
                )}


                <TextField required 
                fullWidth 
                label='Name'
                margin='normal'
                variant='outlined'
                value={name.value}
                onChange={name.changeHandler}

                />
                <TextField required 
                fullWidth 
                label='Bio'
                margin='normal'
                variant='outlined'
                value={bio.value}
                onChange={bio.changeHandler}
                />
                <TextField required 
                fullWidth 
                label='Username'
                margin='normal'
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
                />

                { username.error && (
                    <Typography color='error' variant='caption'>
                        {username.error}
                        </Typography>
                )}

                <TextField required 
                fullWidth 
                label='Pasword'
                type='password'
                margin='normal'
                variant='outlined'
                value={password.value}
                onChange={password.changeHandler}
                />
                
                <Button variant='contained' color='primary' type='submit' fullWidth
                sx={{
                    mt:'1rem'
                }}
                >
                    Sign Up
                </Button>
                <Box sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography sx={{ marginTop: '1rem'}}>
                    OR
                </Typography>
                <Button variant='text' color='primary' onClick={toggleLogin} >
                    LogIn Instead
                </Button>
                </Box>
            </form>

            </>
            )
        }
            </Paper>
      
    </Container>
    </div>
    </>
  )
}

export default Login
