import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

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
