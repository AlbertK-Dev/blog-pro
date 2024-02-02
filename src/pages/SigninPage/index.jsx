import {
  Email,
  Facebook,
  Google,
  Lock,
  Mail,
  PermPhoneMsg,
 
  Twitter,
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
 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styles from "./style";
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import app from "../../firebase/config";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";

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

  async function loginUser(formValues) {
    //TODO code pour Connecter l'utilisateur
    try {
      await signIn(formValues.email, formValues.password);
      toast.success("connexion réussi", {
        position: "top-center",
      });
      setTimeout(() => navigate("/app"), 2000);
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
    <Stack sx={{ ...styles.Stack, color: "black" }}>
      <ToastContainer />
      <Box
        sx={{
          ...styles.box,

          transform: onSmallDevice ? "scale(0.9,0.9)" : "scale(0.9,0.9)",
          width: onSmallDevice ? "90%" : 450,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ ...styles.center, flexDirection: "column", gap: "2px" }}>
            <Typography variant="button" sx={styles.text}>
              connectez-vous à Blog-Pro
            </Typography>
          </Box>
          <Tooltip
            title='veuillez saisir votre adresse email'
          >
            <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
              <TextField
                
                size={onSmallDevice ? "small" : "medium"}
                {...formik.getFieldProps("email")}
                name="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail sx={{ color: ICONS_COLOR }} />
                    </InputAdornment>
                  ),
                }}
                margin="dense"
                id="register-email"
                type="email"
                fullWidth
                label="adresse email"
                variant="standard"
              />{" "}
            </Box>
          </Tooltip>

          <Tooltip
            title='Veuillez saisir votre mot de passe'
          >
            <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
              <TextField
                
                id="register-password"
                label="mot de passe"
                variant="standard"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="dense"
                name="password"
                {...formik.getFieldProps("password")}
                size={onSmallDevice ? "small" : "medium"}
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
                          <VisibilityOff sx={{ color: ICONS_COLOR }} />
                        ) : (
                          <Visibility sx={{ color: ICONS_COLOR }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: ICONS_COLOR }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Tooltip>

          <Tooltip
            title={
              (!formik.isValid && "tous les champs ne sont pas valides") ||
              (formik.isSubmitting && "validation en cours...")
            }
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>

<Button size="medium" color="primary" disableElevation

    variant="contained" type="submit" disabled={!formik.isValid || formik.isSubmitting} >
    Se connecter
</Button>

</Box>
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
              border: `2px solid ${ICONS_COLOR}`,
            },
            "&:before": {
              border: `2px solid ${ICONS_COLOR}`,
            },
          }}
        >
          <Chip
            label="OU"
            size="medium"
            sx={{
              // border: `2px solid ${ICONS_COLOR}`,
              color: "white",
              backgroundColor: ICONS_COLOR,
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
            }}
          >
            <Tooltip title="se connecter avec Google" placement="top" arrow>
              <IconButton
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, new GoogleAuthProvider());

                    window.location.reload();
                  } catch (error) {
                    setSigninError(error.code);
                  }
                }}
              >
                <Google color="primary" sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="se connecter avec Facebook" placement="top" arrow>
              <IconButton
                onClick={async () => {
                  try {
                    await signInWithPopup(auth, new FacebookAuthProvider());

                    window.location.reload();
                  } catch (error) {
                    setSigninError(error.code);
                  }
                }}
              >
                <Facebook color="primary" sx={{ color: "blue" }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="recevoir un email de connexion"
              placement="top"
              arrow
            >
              <IconButton
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

            <Tooltip title="se connecter avec Twiter" placement="top" arrow>
              <IconButton>
                <Twitter color="primary" sx={{ color: "skyblue" }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="se connecter avec Un numéro de téléphone"
              placement="top"
              arrow
            >
              <IconButton>
                <PermPhoneMsg color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

export default SigninPage;
