import { Grid, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../styles/StyledComponent'
import { grey } from '@mui/material/colors'

export const LayoutLoader = () =>{
    return(
        <>
        <Grid container height="calc(100vh - 4rem)" columns={12} spacing={'1rem'} >
          {/* First Column */}
          <Grid
            item
            size={{xs:0,sm:4,md:3}}
            height="100%"
            sx={{
              display: { xs: 'none', sm: 'block' },
            }}
          >
             <Skeleton variant='rectangular' height={'100vh'}/>
          </Grid>

          {/* Middle Content */}
          <Grid
            item
              size={{xs:12,sm:8,md:5}}
            height="100%"
          >
            {
                Array.from({length:10}).map((_,index)=>(
                        <Stack key={index} spacing={'1rem'}>
                    <Skeleton  variant='rounded' height={'5rem'}/>
                        </Stack>
                ))
            }
            
          </Grid>

          {/* Third Column */}
          <Grid
            item
            size={{xs:0,md:4}}
            height="100%"
            sx={{
              display: { xs: 'none', md: 'block' },
              
            }}
          >
            <Skeleton variant='rectangular' height={'100vh'}/>
          </Grid>
        </Grid>
        </>
    )
}

export const TypingLoader = () => {
  return <Stack 
  spacing={'0.5rem'}
  direction={'row'}
  padding={'0.5rem'}
  justifyContent={'flex-end'}
 
  >
  <BouncingSkeleton variant='circular' width={15} height={15}
  style={{
    animationDelay: '0.1s',
  }}
  />
   <BouncingSkeleton variant='circular' width={15} height={15}
  style={{
    animationDelay: '0.2s',
  }}
  />
   <BouncingSkeleton variant='circular' width={15} height={15}
  style={{
    animationDelay: '0.4s',
  }}
  />
   <BouncingSkeleton variant='circular' width={15} height={15}
  style={{
    animationDelay: '0.6s',
  }}
  />

  </Stack>
}
