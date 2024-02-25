import {
  Email,
  Facebook,
  KeyOutlined,
  Mail,
  Visibility,
  VisibilityOff,
  ReportProblem,
} from "@mui/icons-material";
import {
  Box,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Chip,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "./style";
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  isSignInWithEmailLink,
  linkWithRedirect,
  sendSignInLinkToEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";
import app, { dbPersist } from "../../firebase/config";
import { doc,setDoc } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import { GoogleColorIcon } from "../SignupPage/svgIcons";

import { blue } from "@mui/material/colors";



const auth = getAuth(app);
const db = dbPersist;
const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

  const createUserWithEmailInDB =  (email, pseudo, uid) => {
    const userRef = doc(db, 'users', uid);
   setDoc(userRef, { email, pseudo}, {merge:true});
}
const updatePasswordInDB = (password, uid) => {
  
  const userRef = doc(db, 'users', uid);
 setDoc(userRef, {  password }, { merge: true });
}

function SigninPage() {
  //!utile pour la mise en page du travail
  const [showPassword, setShowPassword] = useState(false);
  const { innerWidth } = useDimensions();
  const [signinError, setSigninError] = useState("");
  const [signinEmailError, setSigninEmailError] = useState("");
  const [signinPassError, setSigninPassError] = useState("");
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
 console.log(auth.currentUser)
    signInWithEmailLink(auth, email, window.location.href)
      .then(async () => {
        window.localStorage.removeItem("emailForSignIn");
        await linkWithRedirect(auth.currentUser, new GoogleAuthProvider()).catch(
          (error) => {
            setSigninEmailError(
              `erreur linking with redirect ${error.code || error.message || error.statusText
              }`
            );
            toast.error(signinError, {
              position: "top-right",
            });
          }
        );
        const pseudo = `BP_user-${new Date().getTime().toString()}`;

         createUserWithEmailInDB(email, pseudo, auth.currentUser.uid);
        toast.success("connexion réussi ", {
          delay: 1000,
          position: 'top-right'
        });
        window.location.reload();
      })
      .catch((error) =>
      
        toast.error(`erreur signin with email link ${error.code || error.message || error.statusText
          }`, {
          delay: 1000,
          position: 'top-right'
        })
    );
  }, [signinError]);

  async function loginUser(formValues) {
    //TODO code pour Connecter l'utilisateur
    try {
      const userCred = await signIn(String(formValues.email).trim(), formValues.password);
      await updatePasswordInDB(formValues.password, userCred.user.uid)
      toast.success("connexion réussi", {
        position: "top-center",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.log(error.code)
      
      
      if (error.code === 'auth/network-request-failed') {
        setEmailError('')
        setSigninError('Impossible de joindre le serveur, vérifiez votre connexion internet')
        setSigninPassError('')
        return;
      }
      if (error.code === 'auth/invalid-email') {
        setEmailError('le format de votre adresse email n\'est pas valide.')
        setSigninError('')
        setSigninPassError('')
        return;
      }
      setEmailError('')
      setSigninError('')
      setSigninPassError('Informations invalides, vérifiez votre mot de passe.');

      
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
    <Stack id='signinForm'  sx={{ ...styles.Stack, color: "black" }}>
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
        <form  id='signinForm' onSubmit={formik.handleSubmit}>
          <Box sx={{ ...styles.center, flexDirection: "column", gap: "2px" }}>
            <Typography
              variant="body1"
              sx={{
                ...styles.text,
                justifyContent: "center",
                fontFamily: "Poppins",
                mb: "16px",
                fontSize: "16px",
                color: ICONS_COLOR,
                opacity:0.7
                
              }}
            >
              Connectez-vous pour continuer
            </Typography>
          </Box>
          
          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={emailError}
              size={"small"}
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
                      color="primary"
                      sx={{  width: "16px", height: "16px" }}
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
              id="register-email"
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
            
            <TextField
              id="register-password"
              label="mot de passe"
              variant="outlined"
              error={signinPassError}
              type={showPassword ? "text" : "password"}
              fullWidth
              //   margin="normal"
              sx={{ fontFamily: "Oswald" }}
              name="password"
              onChange={(e) => {
                setSigninPassError('');
                setSigninError('')
               
                formik.handleChange(e)
              }}
              onBlur={formik.handleBlur}
              size={onSmallDevice ? "small" : "small"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {(signinPassError === null || signinPassError ==="") ? (showPassword  ? (
                        <VisibilityOff
                          color="primary"
                          sx={{
                            
                            width: "16px",
                            height: "16px",
                          }} 
                        />
                      ) : (
                          <Visibility
                            color="primary"
                          sx={{
                            
                            width: "16px",
                            height: "16px",
                          }} 
                        />
                      )): (signinPassError  && <ReportProblem color="error" sx={{
                        
                        width: "16px",
                        height: "16px",
                      }} />)}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlined
                      color="primary"
                      sx={{ width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Typography variant="body2" sx={{ color: "red", mt:1 }}>
              {signinPassError}
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
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "column",
                gap: 1
              }}
            >
              <Button
                id="connect-button"
                size={onSmallDevice ? "small" : "medium"}
                fullWidth
                color="primary"
                disableElevation
                variant="contained"
                sx={{ mt: 3, '& :disabled': { opacity:0.5, } }}
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Se connecter
              </Button>
              <Typography
                variant="body2"
                sx={{ textAlign: "left", display: "inline-block",mt:1 }}
              >
                <RouterLink
                  id="resetpass-link"
                  to={"/reset-pwd"}
                  style={{
                    color:'gray',
                    fontFamily: "Poppins",
                   // display: signinError ? "inline-block" : "none",
                    fontSize: "14px",
                    textDecoration: "none",

                  }}
                >
                  réinitialisé le mot de passe ?
                </RouterLink>
              </Typography>
            </Box>
            <FormControlLabel sx={{mt:2}} control={<Checkbox size="small" defaultChecked onChange={ async (e) => {
              if (e.target.checked) {
                
                try {
                  await setPersistence(auth, browserLocalPersistence)
                } catch (error) {
                  setSigninError('persistence error')
                  
                }
              } else {
                try {
                  await setPersistence(auth, browserSessionPersistence)
                } catch (error) {
                  setSigninError('persistence error')
                  
                }
                
              }
            }} />} label="Se souvenir de moi?" />
            {/* <Typography variant="body2" sx={{ color: "red" }}>
              {signinError}
            </Typography> */}
          </Tooltip>
        </form>

        <Divider
          sx={{
            color: ICONS_COLOR,
            fontSize: "20px",
            "&:after": {
              //border: `1px solid gray`
            },
            "&:before": {
              // border: `1px solid gray`
            },
          }}
        >
          <Chip
            label="OU"
            size="small"
            sx={{
              // border: `2px solid ${ICONS_COLOR}`,
              color: "gray",
              backgroundColor: "white",
            }}
          />
        </Divider>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection:'column',
          }}
        >
          <Box
            sx={{
              ...styles.text,
              justifyContent: "flex-start",
              backgroundColor: "",
              gap: 1,
            }}
          >
            <Tooltip title="se connecter avec Google" placement="top" arrow>
              <IconButton
                sx={{ border: "0px solid red" }}
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, new GoogleAuthProvider());

                    window.location.reload();
                  } catch (error) {
                    setSigninError(error.code);
                  }
                }}
              >
                <GoogleColorIcon color="primary" sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="se connecter avec Facebook" placement="top" arrow>
              <IconButton
                sx={{ border: "0px solid #3C5A99" }}
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, new FacebookAuthProvider());

                    window.location.reload();
                  } catch (error) {
                    setSigninError(error.code);
                  }
                }}
              >
                <Facebook color="primary" sx={{ color: "#3C5A99" }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="recevoir un lien de connexion"
              placement="top"
              arrow
            >
              <IconButton
                sx={{ border: "0px solid orange" }}
                onClick={async () => {
                  try {
                    let email = (window.prompt(
                      "veuillez saisir votre email pour recevoir le lien de connexion"
                    ));
                    email = String(email).trim()
                    const actionCodeSettings = {
                      url: window.location.href,
                      handleCodeInApp: true,
                    };
                    sendSignInLinkToEmail(auth, email, actionCodeSettings)
                      .then(() => {
                        window.localStorage.setItem("emailForSignIn", email);

                        toast.info(`lien de connexion envoyé à ${email}`, {
                          delay: 1000,
                          position: "top-center",
                        });
                      })
                      .catch((error) => {
                        setSigninError(
                          error.code || error.message || error.statusText
                        );
                      });
                  } catch (error) {
                    setSigninError(error.code);
                  }
                }}
              >
                <Email color="primary" sx={{ color: "orange" }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ color: "red", mt:1, textAlign:'center' }}>
              {signinError || signinEmailError}
            </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            ...styles.text,
            fontFamily: "Poppins",
            mb: "20px",
            fontSize: "12px",
          }}
        >
          Vous n'avez pas de compte ? {" "}
          <RouterLink
            to={"/register"}
            style={{
              color: ICONS_COLOR,
              fontFamily: "robotto",
              fontSize: "16px",
            }}
          >
            Créez-en un
          </RouterLink>
        </Typography>
      </Box>
    </Stack>
  );
}

export default SigninPage;
