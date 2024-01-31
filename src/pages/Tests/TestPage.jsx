import { Box, Stack, TextField, ThemeProvider, useTheme } from '@mui/material'
import React from 'react'
import muiCustomThemeTextField from './muiCostumThemeTextField'


const styles = {
    fCenter: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
  },
  customTextField:{
    '& .MuiInputLabel-animated': { // le label animé
  
      color: 'yellow',
    },
    '& .MuiInput-underline': { //la couleur du texte
      color: 'green'
    },
    '& .Mui-focused':{ //la couleur du label et du texte quand on a le focus
      color: 'white'

    },
    '& .MuiInput-underline:after': { // pour la barre de soulignement
      border:'3px solid skyblue'
    }
  
  }
}

function TestPage() {
  const myTheme = useTheme()
  return (
    <ThemeProvider theme={muiCustomThemeTextField(myTheme)}>
       <Stack sx={{ ...styles.fCenter, width: '100%', backgroundColor: 'rgba(167, 230, 255,0.9)', height:'100vh' }}>
      <Box sx={{ p: 2, bgcolor: 'skyblue', minWidth: '300px', minHeight: '400px', backgroundColor: 'rgba(0, 0, 0,0.5)' }}>
          <TextField label='je teste' variant='standard' error color='success' fullWidth />
          <TextField label='je teste' variant='standard'  color='success' fullWidth/>
              
          </Box>
          
    </Stack>
    </ThemeProvider>
     
  )
}

export default TestPage