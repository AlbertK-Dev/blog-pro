import React from 'react'
import { createTheme,ThemeProvider } from "@mui/material/styles";
import { blue,   red } from '@mui/material/colors';


const theme = createTheme({
    palette: {
        
        primary: blue,
        error: red,
        ochre: {
            main: '#E3D026',
            light: '#E9DB5D',
            dark: '#A29415',
            contrastText: '#242105',
          },
       
    },
    status: {
        danger:red[500],
        
    },
    typography: {
        fontFamily: 'Poppins',
        fontSize: '15px',
    }
})

function MuiThemeProvider({children}) {
  return (
      <ThemeProvider theme={theme}>
          {children}
      </ThemeProvider>
  )
}

export default MuiThemeProvider