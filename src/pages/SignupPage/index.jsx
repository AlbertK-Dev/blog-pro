import {
  Email,
  Facebook,
  Lock,
  Mail,
  Person,
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
import React, { useState } from "react";
import styles from "./style";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  sendSignInLinkToEmail,
  signInWithPopup /*, signInWithRedirect*/,
  updateProfile,
} from "firebase/auth";

import app, { dbPersist } from "../../firebase/config";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, toast } from "react-toastify";
import valiteRegistration from "./validate";
import { GoogleColorIcon } from "./svgIcons";
import { blue } from "@mui/material/colors";
import { doc, setDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = dbPersist


const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
const updateDisplayName = (pseudo) =>
  updateProfile(auth.currentUser, { displayName: pseudo });

const createUserInDB = (email, pseudo, password, uid) => {
  const userRef = doc(db, 'users', uid);
  setDoc(userRef, { email, pseudo, password });
}

auth.useDeviceLanguage();


async function delay(temps) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            
            resolve();
        }, temps);
    });
}

function SignupPage() {
  //!utile pour la mise en page du travail
  const [showPassword, setShowPassword] = useState(false);
  const { innerWidth } = useDimensions();
  const [signupError, setSignupError] = useState("");

  const onSmallDevice = innerWidth <= 500;
  const navigate = useNavigate();

  async function handleCreateUser(formValues, onSubmittingProps) {
    try {
      //création de l'utilisateur
      const cred = await signUp(formValues.email, formValues.password);
      console.log(cred);

      try {
        // mise a jour du pseudo
        await updateDisplayName(formValues.pseudo);
        await createUserInDB(formValues.email, formValues.pseudo, formValues.password, cred.user.uid)
        
      } catch (error) {
        toast.error(error.code);
      }

      //TODO sauvegarder les informations dans le store et dans la bd

       toast.success("compte créer avec succès ");
        await delay(3000)
      onSubmittingProps.resetForm();

      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setSignupError("email already in use");
        toast.error("cette adresse email est déja utilisé");
      } else {
        setSignupError(error.code || error.message || error.statusText);
        toast.error("erreur inatendu");
      }
    }

    //TODO code pour créer l'utilisateur
  }

  //? Préparons le térrain pour formik
  const initialValues = {
    email: "",
    pseudo: "",

    password: "",

    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: handleCreateUser,
    validate: valiteRegistration,
  });

  const ICONS_COLOR = "#1976d2";

  return (
    <Stack
      sx={{
        ...styles.Stack,
        fontFamily: "Open Sans",
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          ...styles.box,

          transform: onSmallDevice ? "scale(0.9,0.9)" : "scale(1,1)",
          marginTop: onSmallDevice ? "10px" : null,
          width: onSmallDevice ? "90%" : 400,
          border: "0px solid gray",
          padding: "20px",
         // boxShadow:  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            ...styles.text,
            //fontFamily: "Playfair Display",
            fontFamily: "Great Vibes",
            fontSize: "50px",
            //fontWeight: "bold",
            textShadow: `2px 2px 5px ${blue[400]}`,
           // textShadow: `2px 2px 5px black`,
           // color: 'white',
            textDecoration: 'underline'
          }}
        >
          Blog-Pro
        </Typography>
        <form onSubmit={formik.handleSubmit}>
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
            Inscrivez-vous pour commencer
          </Typography>

          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={formik.errors.pseudo && formik.touched.pseudo}
              color={
                !formik.errors.pseudo && formik.touched.pseudo
                  ? "success"
                  : null
              }
              helperText={
                formik.errors.pseudo && formik.touched.pseudo
                  ? formik.errors.pseudo
                  : null
              }
              size={"small"}
              {...formik.getFieldProps("pseudo")}
              name="pseudo"
              sx={{ fontFamily: "Poppins", borderRadius: "10px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person
                      sx={{ color: ICONS_COLOR, width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
              margin="normal"
              id="register-pseudo"
              type="text"
              fullWidth
              label="votre Pseudo"
              variant="outlined"
            />{" "}
          </Box>

          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={formik.errors.email && formik.touched.email}
              color={
                !formik.errors.email && formik.touched.email ? "success" : null
              }
              helperText={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : null
              }
              size={"small"}
              {...formik.getFieldProps("email")}
              name="email"
              sx={{ fontFamily: "Poppins", borderRadius: "10px" }}
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

          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              error={formik.errors.password && formik.touched.password}
              color={
                !formik.errors.password && formik.touched.password
                  ? "success"
                  : null
              }
              id="register-password"
              label="mot de passe"
              variant="outlined"
              helperText={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : null
              }
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
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
                          }} /*sx={{ color: ICONS_COLOR }}*/
                        />
                      ) : (
                        <Visibility
                          sx={{
                            color: ICONS_COLOR,
                            width: "16px",
                            height: "16px",
                          }} /*sx={{ color: ICONS_COLOR }}*/
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{ color: ICONS_COLOR, width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <TextField
              color={
                !formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? "success"
                  : null
              }
              error={
                formik.errors.confirmPassword && formik.touched.confirmPassword
              }
              helperText={
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? formik.errors.confirmPassword
                  : null
              }
              id="register-password-confirm"
              label="confirmer le mot de passe"
              variant="outlined"
              type="password"
              sx={{ fontFamily: "Oswald" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      sx={{ color: ICONS_COLOR, width: "16px", height: "16px" }}
                    />
                  </InputAdornment>
                ),
              }}
              fullWidth
              margin="normal"
              name="confirmPassword"
              {...formik.getFieldProps("confirmPassword")}
              size={onSmallDevice ? "small" : "small"}
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
                sx={{ mt: 3 }}
                size={onSmallDevice ? "small" : "medium"}
                fullWidth
                color="primary"
                disableElevation
                variant="contained"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                S'inscrire
              </Button>
            </Box>

            <Typography variant="body2" sx={{ color: "red" }}>
              {signupError}
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
                    setSignupError(error.code);
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
                    setSignupError(error.code);
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
                        setSignupError(
                          error.code || error.message || error.statusText
                        );
                      });
                  } catch (error) {
                    setSignupError(error.code);
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
          Vous avez déja un compte ? {" "}
          <RouterLink
            to={"/login"}
            style={{
              color: ICONS_COLOR,
              fontFamily: "robotto",
              fontSize: "16px",
            }}
          >
            Connectez-vous
          </RouterLink>
        </Typography>
      </Box>
    </Stack>
    // </ThemeProvider>
  );
}

export default SignupPage;
