import {

  Facebook,
  Google,
  Lock,
  Mail,
  PermPhoneMsg,
  Person,
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
  Avatar,
  Link,
} from "@mui/material";
import {Link as RouterLinK, useNavigate} from 'react-router-dom';
import React, {  useState } from "react";
import styles from "./style";
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/config";
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';


const auth = getAuth(app)
const signIn =(email, password) => signInWithEmailAndPassword(auth, email, password)


function SigninPage() {
  //!utile pour la mise en page du travail
  const [showPassword, setShowPassword] = useState(false);
  const { innerWidth } = useDimensions();
 // const [signinError, setSigninError] = useState('');
  const onSmallDevice = innerWidth <= 500;
 const navigate = useNavigate()

  async function loginUser(formValues) {
   
    //TODO code pour Connecter l'utilisateur
    try {
      
      await signIn(formValues.email, formValues.password);
      toast.success('connexion réussi', {
        position: 'top-center',
        
      })
      setTimeout(()=> navigate('/app'),2000 )
      
    } catch (error) {

      //setSigninError(error.code || error.message || error.statusText)
      toast.error('email ou mot de passe Incorrect' ||error.code || error.message || error.statusText, {
        position: 'top-center',
        autoClose: 2000,
      })
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



  return (
    <Stack sx={{ ...styles.Stack, color: 'white'}}>
      <ToastContainer/>
      <Box sx={{...styles.box, width: onSmallDevice? 300: 500}}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ ...styles.center, flexDirection: 'column', gap: '2px' }}>
            {/* <Avatar fontSize={''} />  //TODO faire en sorte que la photo de profil de l'utilisateur apparaisse */}
            <Avatar> <Person fontSize="large" /></Avatar>

            <Typography variant="button" sx={styles.text}>

              connectez-vous
            </Typography>
          </Box>


          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <Mail sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              
              size={onSmallDevice ? "small" : "medium"}
              {...formik.getFieldProps("email")}
              name="email"
              required
              margin="dense"
              id="login-email"
              type="email"
              fullWidth
              label="adresse email"
              variant="filled"
            />
          </Box>

          <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
            <Lock sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField
              
              id="login-password"
              label="mot de passe"
              variant="filled"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              name="password"
              {...formik.getFieldProps("password")}
              required
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
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>



          <Tooltip title={(!formik.isValid && 'tous les champs ne sont pas valides') || (formik.isSubmitting && 'validation en cours...')}>
          <Button fullWidth size="small" variant="contained" type="submit">
            Se connecter
          </Button>
            {/* <Typography variant="body2" sx={{ color: 'red' }}>{signinError}</Typography> */}
            </Tooltip>
        </form>
        <Divider>
          <Chip label="vous n'avez pas de compte?" size="small" />
        </Divider>
        <Typography variant="boutton" sx={{ ...styles.text, textTransform: "uppercase" }}>
          Cliquez
          <Tooltip title={'Cliquer ICI pour créer un compte'} placement="top" arrow>
            <Link component={"button"} underline="hover">
              <RouterLinK to={'/register'}>
                {` - ICI - `}
              </RouterLinK>


            </Link>
          </Tooltip>
          pour en créer

        </Typography>
        <Divider>
          <Chip label="utiliser un fournisseur d'identité" size="small" />
        </Divider>
        <Box sx={{ ...styles.text, justifyContent: "space-between" }}>
          <Tooltip title="se connecter avec Google" placement="top" arrow>
            <IconButton>
              <Google color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="se connecter avec Facebook" placement="top" arrow>
            <IconButton>
              <Facebook color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="se connecter avec Twiter" placement="top" arrow>
            <IconButton>
              <Twitter color="primary" />
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
    </Stack>
  );
}

export default SigninPage;
