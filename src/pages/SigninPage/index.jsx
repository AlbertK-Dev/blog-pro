import {
  Email,
  Facebook,
  KeyOutlined,
  Mail,
  Visibility,
  VisibilityOff,
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
import app from "../../firebase/config";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import { GoogleColorIcon } from "../SignupPage/svgIcons";
import './style.css';
import { blue } from "@mui/material/colors";


const auth = getAuth(app);
const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

function SigninPage() {
  //!utile pour la mise en page du travail
  const [showPassword, setShowPassword] = useState(false);
  const { innerWidth } = useDimensions();
  const [signinError, setSigninError] = useState("");

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
      await signIn(formValues.email, formValues.password);
      toast.success("connexion réussi", {
        position: "top-center",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setSigninError(error.code || error.message || error.statusText);
      toast.error(
        "email ou mot de passe Incorrect" ||
          error.code ||
          error.message ||
          error.statusText,
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
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
          transform: onSmallDevice ? "scale(0.9,0.9)" : "scale(1,1)",
          marginTop: onSmallDevice ? "10px" : null,
          width: onSmallDevice ? "90%" : 400,
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
            textShadow: `2px 2px 5px ${blue[500]}`,
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
              error={formik.errors.email && formik.touched.email}
              size={"small"}
              {...formik.getFieldProps("email")}
              name="email"
             
             
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail
                      sx={{ color: ICONS_COLOR, width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
              margin="normal"
              id="register-email"
              type="email"
              fullWidth
              label="adresse email"
              variant="outlined"
            />{" "}
          </Box>

          <Box
            sx={{
              ...styles.boxField,
              alignItems: "baseline",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                mt: 1,
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{ textAlign: "left", display: "inline-block" }}
              >
                <RouterLink
                  id="resetpass-link"
                  to={"/reset-pwd"}
                  style={{
                    color:'gray',
                    fontFamily: "Poppins",
                    display: signinError ? "inline" : "none",
                    fontSize: "14px",
                    textDecoration: "none",

                  }}
                >
                  réinitialisé le mot de passe ?
                </RouterLink>
              </Typography>
            </Box>
            <TextField
              id="register-password"
              label="mot de passe"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              //   margin="normal"
              sx={{ fontFamily: "Oswald" }}
              name="password"
              {...formik.getFieldProps("password")}
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
                      {showPassword ? (
                        <VisibilityOff
                          sx={{
                            color: ICONS_COLOR,
                            width: "16px",
                            height: "16px",
                          }} 
                        />
                      ) : (
                        <Visibility
                          sx={{
                            color: ICONS_COLOR,
                            width: "16px",
                            height: "16px",
                          }} 
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlined
                      sx={{ color: ICONS_COLOR, width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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
            <Typography variant="body2" sx={{ color: "red" }}>
              {signinError}
            </Typography>
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
                    const email = window.prompt(
                      "veuillez saisir votre email pour recevoir le lien de connexion"
                    );
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
