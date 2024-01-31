import { Home, Mail, Send } from '@mui/icons-material';
import { Box, Stack, TextField, Button, Typography } from '@mui/material'
import React from 'react'
import { useDimensions } from '../../hooks/useDimensions';
import { Link,    useLoaderData} from 'react-router-dom';
import { getAuth,  sendEmailVerification /*,signOut*/ } from 'firebase/auth';
import app from '../../firebase/config';
import { useState } from 'react';

const styles = {
  Stack: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh',
      backgroundColor: '#f5f5f5'
  },
  box: {
      minheight: 400,
      width: 300,
      padding: 3,
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: 2



  },
  boxField: {
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%'
      
  },
  text: {
      display: 'flex',
      alignItems: 'center',
      justifyContent:'center',
  },
  center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent:'center',
  }
}



 



function EmailVerificator() {



  const auth = getAuth(app)
  const sendMail = () => sendEmailVerification(auth.currentUser)
  //const disconnect = () => signOut(auth)
  auth.useDeviceLanguage();
 

  const { innerWidth } = useDimensions();
  const onSmallDevice = innerWidth <= 500;
  
 const email = useLoaderData()
  const [EmailAlreadySend, setEmailAlreadySend] = useState(false);
  
  
 

  async function emailSender() {
    try {
      await sendMail()
     //await disconnect()

      setEmailAlreadySend(true)
    //await disconnect()
     // window.localStorage.removeItem(LS_USER_AUTH_DATA)
     
      


      
    } catch (error) {
      window.alert(error.code || error.message || error.statusText)
      
    }
    
  }

  return (
    <Stack sx={styles.Stack}>
      <Box sx={{ ...styles.box, width: onSmallDevice ? 300 : 500 }}>
      {EmailAlreadySend===false && <Typography variant='body2' sx={{textAlign:'center'}}>
          Votre compte à bien été créer,<br />
          Mais on va quand mème vérifier histoire de vous ,<br />
          perdre du temps {'\u{1F602}'}.
          <mark  style={{ color: 'red' }}> <u>ATTENTION:</u> vous ne
            pourrez pas accéder aux fonctionnalités avancées du site
            si votre email n'est pas vérifier  </mark>
          

        </Typography>}
        {EmailAlreadySend === false && <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
        <Mail sx={{ color: "action.active", mr: 1, my: 0.5 }} />

          <TextField
            value={email}
            
            name="email"
            required
            margin="dense"
            id="login-email"
            type="email"
            fullWidth
            label="adresse email"
            variant="filled"
            size={onSmallDevice ? "small" : "medium"}
          />
        </Box>}
        {EmailAlreadySend === false && <Button  endIcon={<Send fontSize='large'/>} fullWidth size="large" variant="contained" type="button" onClick={()=>emailSender()} >
            Cliquez ici pour Recevoir l'email de vérification
        </Button>}
        {EmailAlreadySend && <Typography variant='body2' sx={{textAlign:'center'}}>
          Un lien de vérification vous à été envoyez,<br />
          veuillez ouvrir votre boite de méssagerie,<br />
          cliquer sur ce lien puis revenir sur BLOG-PRO et
          vous connectez avec vos informations.
          <mark  style={{ color: 'red' }}> <u>ATTENTION:</u> vous ne
            pourrez pas accéder aux fonctionnalités avancées du site
            si votre email n'est pas vérifier </mark>

        </Typography>}
        
        après avoir vérifier votre email, <Link to={'/'}>
          
            <Button endIcon={<Home fontSize='large' />} fullWidth size="small" variant="contained" type="button">
              Cliquez ici pour Retourner à l'accueil 
            </Button>
        </Link> 
          

      </Box>

    </Stack>
  )
}

export default EmailVerificator