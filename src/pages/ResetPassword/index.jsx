import {
 
  Mail,
  
  ReportProblem,
  ArrowBackIos,
  LockPerson,
  Send,
  Autorenew
  
 
} from "@mui/icons-material";
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Button,
 

} from "@mui/material";
import { blueGrey, grey, red } from "@mui/material/colors";
import {  Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "./style";

import { useFormik } from "formik";
import {
 
  getAuth,
 
  sendPasswordResetEmail,
 

} from "firebase/auth";
import app from "../../firebase/config";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

import { useLang } from "../../provider/langProvider";


const auth = getAuth(app);

const setLink = async (email) => {
  const actionCodeSettings = {
    url: `${window.location.protocol}//${window.location.host}/login`,
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
 
}

function Timer({end = 60, onTimerComplete}) {
 const  [time, setTime] = useState(end)

  useEffect(() => {
    const myInterval = setInterval(() => setTime(time - 1), 600)

    return () => clearInterval(myInterval);
  },[time])
  
  if (time === 0) {
    
    onTimerComplete()
  }

  return (
    <>
      <Box component={'div'} sx={{display: 'inline-block', textAlign:'center',width:'16px', height:'16px', borderRadius:'100%', backgroundColor:'#f5f5f5', border:'2px solid black', padding:'5px'}}>
        {time}
      </Box>
    </>
  )
  
}

function ResetPassword() {
  //!utile pour la mise en page du travail

  
  const [signinError, setSigninError] = useState("");
  const [emailError, setEmailError] = useState('');
  const [emailAlreadySend, setEmailAlreadySend] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [timerComplete, setTimerComplete] = useState(false);
  const [timerTime, setTimerTime] = useState(10)
  const { texts} = useLang()
 

 
 



  async function loginUser(formValues) {
    //TODO code pour Connecter l'utilisateur
    try {

       await setLink(String(formValues.email).trim())
     
      toast.success("succès", {
        position: 'top-right',
        autoClose: 300,
      });
       setEmailAlreadySend(true)
      
    } catch (error) {
      
      if (error.code === 'auth/missing-email') {
        setEmailError(texts.errors.emptyField)
        setSigninError('')
        return;
      }
      if (error.code === 'auth/invalid-email' ) {
        setEmailError(texts.errors.email)
        setSigninError('')
        return;
      }
      setEmailError('')
      setSigninError(texts.errors.other);

      
    }
  }

  //? Préparons le térrain pour formik
  const initialValues = {
    email: "",
    
  };

  const formik = useFormik({
    initialValues,
    onSubmit: loginUser,
  });

  const ICONS_COLOR = "#1976d2";

  return (
    <Stack id='signinForm' sx={{ ...styles.Stack, color: "black", }}>
      <ToastContainer />
      
      <Box
        
        sx={{
          ...styles.box,
          transform: {xs:"scale(0.9,1)", sm : "scale(1,1)"},
          marginTop: {xs:"10px", sm: null},
          width:  {xs:"100%", sm : 400},
          height:{xs:'100%', sm:'auto'},
          border: "0px solid gray",
          padding: "20px",
          //backgroundColor: '#ddd',
          //backgroundColor: '#f5f5f5',
         // boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        {/* <Typography
          variant="body1"
          sx={{
            ...styles.text,
            fontFamily: "Great Vibes",
            fontSize: "50px",
            //fontWeight: "bold",
            textShadow: `2px 2px 3px ${blue[500]}`,
            //textShadow: `2px 2px 5px black`,
            //color: 'white',
            textDecoration: 'underline'
          }}
        >
          Blog-Pro
        </Typography> */}
        <Box width={"100%"} sx={{...styles.text}} >
          <LockPerson sx={{ width: '100px', height: '100px', color: 'skyblue', border: '2px solid skyblue', borderRadius:'50%'}}/>

        </Box>
        <Typography
          variant="body1"
          sx={{
            ...styles.text,
            fontFamily: "Poppins",
            fontSize: "25px",
            //fontWeight: "bold",
           // textShadow: `2px 2px 3px ${blue[700]}`,
           // textShadow: `2px 2px 5px blue`,
            color: blueGrey[500],
            //textDecoration: 'underline'
            textAlign:'center'
          }}
        >
          {emailAlreadySend === true ? 'Consultez-votre boite de méssagerie!' :'Mot de passe Oublié ?'}
        </Typography>
        <form  id='signinForm' onSubmit={formik.handleSubmit}>
          <Box sx={{ ...styles.center, flexDirection: "column", gap: "2px" }}>
            <Typography
              variant="body1"
              sx={{
                ...styles.text,
                
                fontFamily: "Poppins",
                mb: "16px",
                fontSize: "16px",
                color: grey[900],
                opacity: 0.7,
                textAlign:'center'
                
              }}
            >
              {
                emailAlreadySend === true ? `un lien de réinitialisation de mot de passe vient d'etre envoyé à ${emailValue} ouvrer votre boite de messagerie et cliquer sur le lien`:

                'nous allons vous envoyé un lien de réinitialiasation de mot de passe, veuillez renseigné votre adresse email et cliquer sur envoyer'
              }
            </Typography>
          </Box>

          {emailAlreadySend === false && <>
            <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={emailError}
              size='large'
              onChange={(e) => {
                setEmailError('');
                setEmailValue(String(e.target.value).trim());
               
                formik.handleChange(e)
              }}
              onBlur={formik.handleBlur}
              name="email"
             
             
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail
                      sx={{ color: ICONS_COLOR,}}
                    />
                  </InputAdornment>
                ),
                endAdornment:  (
                  <InputAdornment position="end">
                    {emailError && <ReportProblem sx={{ color: red[500], width: "16px", height: "16px" }}/>}
                  </InputAdornment>
                )}
              }
              margin="normal"
              id="reseter-email"
              type="text"
              fullWidth
              label="adresse email"
              variant="outlined"
            />{" "}
          </Box>

          <Typography variant="body2" sx={{ color: "red", mt:0 }}>
              {emailError}
            </Typography>
          </>  }
          



          <Box sx={{
            ...styles.boxField,
            alignItems: "baseline",
            flexDirection: "column",
            mt:3
          }} />

          <Typography variant="body2" sx={{ color: "red", mt:1 }}>
              {signinError}
            </Typography>

          
            <Box
              sx={{
                display: "flex",
                gap:2
                
              }}
            >
              <RouterLink to={-1}  style={{display:'block', width:'50%'}} >
                    <Button  color="primary"
                  disableElevation
                  startIcon={<ArrowBackIos/>}
                  fullWidth
                variant="outlined"
                  sx={{  borderRadius: '20px'}} >Retour</Button>
            </RouterLink>
            {emailAlreadySend === false && <Button
              id="connect-button"
              color="primary"
              endIcon={<Send />}
              disableElevation
              variant="contained"
              sx={{ borderRadius: '20px', width: '50%' }}
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              envoyer
            </Button>}
            {emailAlreadySend  && <Button
              id="connect-button"
              color="primary"
              endIcon={<Autorenew />}
              disableElevation
              variant="contained"
              sx={{ borderRadius: '20px', width: '50%', fontSize:'10px' }}
              onClick={() => { setEmailAlreadySend(false);  setTimerComplete(false)}}
              type="button"
                
            >
              Ce n'était pas vous?
            </Button>}    
          </Box>


          <Box sx={{ display: 'flex', justifyContent: 'center', alignContent:'center', gap:2, mt:2, width: '100%'}}>
            {emailAlreadySend && timerComplete === false ?
              <Timer  end={timerTime} onTimerComplete={() => setTimerComplete(true)} /> : null}
          {emailAlreadySend && timerComplete && <Button
              id="connect-button"
              color="primary"
              endIcon={<Send />}
            disableElevation
            fullWidth
              variant="contained"
              sx={{ borderRadius: '20px', width: {sm:'100%', xs:'100%'} , mt:{xs:2, sm:3}}}
              type="button"
              onClick={async () => {
                try {
                
               setTimerTime(timerTime + 10);
                   
                  await setLink(emailValue)
     
                  toast.success("succès", {
                    position: 'top-right',
                    autoClose: 300,
                  });
                  setTimerComplete(false)
                   setEmailAlreadySend(true)
                
                } catch (error) {
                  setSigninError(error.code)
                }
                
              }
              
                
              } 
              
            >
              re-envoyer le lien
            </Button>}
          </Box>
          
           
         
        </form>

   
      
      </Box>
      
    </Stack>
  );
}

export default ResetPassword;
