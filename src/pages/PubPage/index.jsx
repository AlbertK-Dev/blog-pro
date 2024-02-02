import { Start } from '@mui/icons-material'
import { Box,  Button,  Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDimensions } from '../../hooks/useDimensions'
import { Link} from 'react-router-dom'



const styles = {
    backStack: {
        alignItems: 'center',
        justifyContent: 'center',
        
        backgroundColor: 'transparent'
    },
    centerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        minheight: 400,
        width: 300,
        padding: 3,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    }


}

function PubPage() {
    const { innerWidth } = useDimensions();
    const onSmallDevice = innerWidth <= 500
    const onMediumDevice = innerWidth <= 700
   
   
    return (
        <Stack sx={styles.backStack}>
            <Typography variant='button'>
                        BLOG-PRO
                    </Typography>
            <Box sx={{...styles.box, width: (onSmallDevice && 250) || (onMediumDevice && 500) || 700, flexDirection: (onSmallDevice && 'column') || (onMediumDevice && 'column') || 'column'}} >
                <Box sx={{...styles.centerContent, flexDirection:'column', gap: 3}} >
                    
                    <Typography variant='subtitle2'>
                         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex, saepe, nesciunt est aut ratione, laboriosam corrupti hic distinctio eius accusamus non? Officiis
                    </Typography></Box>
                <Divider />
                <Stack direction={'column'} spacing={1} sx={{gap:3, backgroundColor:'whitesmoke'}} >
                    
                    
                    
                    <Link to={'/visitor'}>
                        <Button variant='contained' fullWidth={onSmallDevice}  size='large' endIcon={<Start />} >
                        visiter le site
                    </Button>
                    </Link>
                    
              
          </Stack>

          </Box>
          
    </Stack>
     
      
  )
}

export default PubPage