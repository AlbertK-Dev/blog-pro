import {
 
  Mail,
  
  ReportProblem,
  ArrowBackIos,
  LockPerson,
  Send
  
 
} from "@mui/icons-material";
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Button,
  Tooltip,

} from "@mui/material";
import { blueGrey, grey, red } from "@mui/material/colors";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "./style";
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import {
  GoogleAuthProvider,
  getAuth,
  isSignInWithEmailLink,
  linkWithRedirect,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,

} from "firebase/auth";
import app from "../../firebase/config";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";


import { blue } from "@mui/material/colors";


const auth = getAuth(app);
const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);



function ResetPassword() {
  //!utile pour la mise en page du travail

  const { innerWidth } = useDimensions();
  const [signinError, setSigninError] = useState("");
  const [emailError, setEmailError] = useState('');

  const onSmallDevice = innerWidth <= 500;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return;
    }
    let email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = prompt("Veuillez saisir votre email pour la confirmation");
    }

    signInWithEmailLink(auth, email, window.location.href)
    .then(() => {
      window.localStorage.removeItem("emailForSignIn");
      linkWithRedirect(auth.currentUser, new GoogleAuthProvider()).catch(
        (error) => {
          setSigninError(
            `erreur linking with redirect ${
                  error.code || error.message || error.statusText
                }`
          );
          toast.error(signinError, {
            position: "top-right",
          });
        }
      );
      toast.success("connexion réussi ", {
        delay: 1000,
        position:'top-right'
      });
      window.location.reload();
    })
    .catch((error) =>
      setSigninError(
        `erreur signin with email link ${
              error.code || error.message || error.statusText
            }`
      )
    );
  }, [signinError]);

  async function loginUser(formValues) {
    //TODO code pour Connecter l'utilisateur
    try {
      const actionCodeSettings = {
        url: `${window.location.protocol}//${window.location.host}/login`,
        handleCodeInApp: true,
      };
      console.log(actionCodeSettings, window.location.href, window.location.protocol)
      await sendPasswordResetEmail(auth, formValues.email, actionCodeSettings);
    
      toast.success("succès", {
        position: "top-center",
      });
      
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setEmailError('le format de votre adresse email n\'est pas valide.')
        setSigninError('')
        return;
      }
      setEmailError('')
      setSigninError(error.code);

      
    }
  }

  //? Préparons le térrain pour formik
  const initialValues = {
    email: "",
    password: "",
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
          transform: onSmallDevice ? "scale(0.9,1)" : "scale(1,1)",
          marginTop: onSmallDevice ? "10px" : null,
          width: onSmallDevice ? "100%" : 400,
          height:'100%',
          border: "0px solid gray",
          padding: "20px",
          //backgroundColor: '#ddd',
          //backgroundColor: '#f5f5f5',
         // boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Typography
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
        </Typography>
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
          }}
        >
          Mot de passe Oublié ?
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
              nous allons vous envoyé un lien de réinitialiasation de mot de passe, veuillez renseigné votre adresse email et cliquer sur envoyer
            </Typography>
          </Box>
          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={emailError}
              size='large'
              onChange={(e) => {
                setEmailError('');
               
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



          <Box
            sx={{
              ...styles.boxField,
              alignItems: "baseline",
              flexDirection: "column",
              mt:3
            }}
          >
            
           
          </Box>

          <Typography variant="body2" sx={{ color: "red", mt:1 }}>
              {signinError}
            </Typography>

          <Tooltip
            title={
              (!formik.isValid && "tous les champs ne sont pas valides") ||
              (formik.isSubmitting && "validation en cours...")
            }
          >
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
              <Button
                id="connect-button"
                color="primary"
                endIcon={<Send/>}
                disableElevation
                variant="contained"
                sx={{  borderRadius:'20px', width:'50%' }}
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                envoyer
              </Button>
             
            </Box>
           
          </Tooltip>
        </form>

   
      
      </Box>
    </Stack>
  );
}

export default ResetPassword;
