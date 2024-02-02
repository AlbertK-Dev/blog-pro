import {
    AccountCircle,
    AddAPhoto,
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
    Link,
    Button,
    FormControlLabel,
    Switch,
    Divider,
    Chip,
    Tooltip,
    Avatar,

    styled
    // ThemeProvider,
    // useTheme,
} from "@mui/material";
import React, {  useState } from "react";
import styles from "./style";
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDimensions } from "../../hooks/useDimensions";
import { useFormik } from "formik";
import { FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth,   sendSignInLinkToEmail,  signInWithPopup/*, signInWithRedirect*/, updateProfile } from "firebase/auth";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import app from "../../firebase/config";
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, toast } from 'react-toastify';
import valiteRegistration from "./validate";
// import muiCustomThemeTextField from "../Tests/muiCostumThemeTextField";
// import btnColorTheme from "../Tests/muiCustomButtonTheme";



const auth = getAuth(app)
const storage = getStorage();
const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password)
const updateDisplayName = (pseudo) => updateProfile(auth.currentUser, { displayName: pseudo })
const updatePhotoURL = (photoURL) => updateProfile(auth.currentUser, { photoURL })
//TODO ajouter un update photoURL
auth.useDeviceLanguage();

function SignupPage() {
    //!utile pour la mise en page du travail
    const [showPassword, setShowPassword] = useState(false);
    const { innerWidth } = useDimensions();
    const [signupError, setSignupError] = useState('');
    const [imgChoozen, setImgChoozen] = useState('Default');
    const [imgfile, setImgfile] = useState([])
    const defaultPhotoURL = useLoaderData() || 'none';


    const onSmallDevice = innerWidth <= 500;
    const navigate = useNavigate()


    async function handleCreateUser(formValues, onSubmittingProps) {

       
        try {
            //création de l'utilisateur
           const cred =  await signUp(formValues.email, formValues.password);


            try {
                // mise a jour du pseudo
                await updateDisplayName(formValues.pseudo);

                //mise a jour de la photo de profile
                const userProfilePhotoRef = ref(storage, `users/${cred.user.uid}/photo`);

                let photoURL = '';

                if (imgfile.length === 0) {

                    photoURL = defaultPhotoURL 
                } else {

                await uploadBytes(userProfilePhotoRef, imgfile[0])
                console.log('image envoyé')
                 photoURL = await getDownloadURL(userProfilePhotoRef)
                console.log('url image : ', photoURL)
                await updatePhotoURL(photoURL)
                }
                
                
                



            } catch (error) {

                toast.error(error.code)
            }

            //TODO sauvegarder les informations dans le store et dans la bd

            toast.success('compte créer avec succès ')
            onSubmittingProps.resetForm();

            navigate("/app")

        } catch (error) {

            if (error.code === 'auth/email-already-in-use') {
                setSignupError("email already in use");
                toast.error("cette adresse email est déja utilisé")
            } else {
                setSignupError(error.code || error.message || error.statusText)
                toast.error('erreur inatendu')
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
        acceptTerms: false,
    };

    

    const formik = useFormik({
        initialValues,
        onSubmit: handleCreateUser,
        validate: valiteRegistration,
    });

   
 

    //const mytheme = useTheme()
    const ICONS_COLOR = '#1976d2';
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    console.log(formik.values)
    return (
        
        <Stack sx={{
            ...styles.Stack
        }}>
            <ToastContainer />
            <Box sx={{
                ...styles.box,

                transform: onSmallDevice ? 'scale(0.9,0.9)' : 'scale(0.8,0.8)',
                marginTop: onSmallDevice? '10px':null,
                width: onSmallDevice ? '90%' : 450,
                
            }}>

                <form onSubmit={formik.handleSubmit}>

                    <Box sx={{...styles.flexCenter}}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', position: 'relative', }}>
                            <Avatar sx={{ ...styles.avatar }} className="photoPreview" alt="Photo De Profile" src={imgChoozen} />
                            <Tooltip title='Ajouter une photo de Profil'><IconButton size="small" sx={{ height: '24px', width: '24px', zIndex: 5, position: 'absolute', right: '0', bottom: 0 }} component="label" >
                                <AddAPhoto color="primary" />

                                <VisuallyHiddenInput
                                    className="inputPhoto"
                                   
                                    onChange={(e) => {
                                        console.log(e.target.files[0])
                                        setImgChoozen(window.URL.createObjectURL(e.target.files[0]).toString())
                                        
                                    setImgfile(e.target.files);

                                    }}
                                    
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    capture name="avatar" />
                            </IconButton></Tooltip>

                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ ...styles.text, }}>
                        Créer un compte - BLOG-PRO
                    </Typography>




                    <Tooltip title={
                        formik.errors.pseudo && formik.touched.pseudo
                            ? formik.errors.pseudo
                            : null
                    }>
                        <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                            <TextField

                                error={formik.errors.pseudo && formik.touched.pseudo}
                                color={!formik.errors.pseudo && formik.touched.pseudo ? 'success' : null}

                                size={onSmallDevice ? "small" : "medium"}
                                name="pseudo"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle sx={{ color: ICONS_COLOR }} />
                                        </InputAdornment>
                                    ),
                                }}



                                {...formik.getFieldProps("pseudo")}
                                margin="dense"
                                id="register-pseudo"
                                fullWidth
                                label="Pseudo"
                                variant="standard"
                            />
                        </Box>
                    </Tooltip>



                    <Tooltip title={
                        formik.errors.email && formik.touched.email
                            ? formik.errors.email
                            : null
                    }><Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                            <TextField
                                error={formik.errors.email && formik.touched.email}
                                color={!formik.errors.email && formik.touched.email ? 'success' : null}

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
                            /> </Box>
                    </Tooltip>





                    <Tooltip title={
                        formik.errors.password && formik.touched.password
                            ? formik.errors.password
                            : null
                    }>
                        <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                            <TextField
                                error={formik.errors.password && formik.touched.password}
                                color={!formik.errors.password && formik.touched.password ? 'success' : null}
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
                                                {showPassword ? <VisibilityOff sx={{ color: ICONS_COLOR }} /> : <Visibility sx={{ color: ICONS_COLOR }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: ICONS_COLOR }} />
                                        </InputAdornment>

                                    ),
                                }}
                            /></Box>


                    </Tooltip>


                    <Tooltip title={
                        formik.errors.confirmPassword && formik.touched.confirmPassword
                            ? formik.errors.confirmPassword
                            : null
                    }>    <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                            <TextField
                                color={!formik.errors.confirmPassword && formik.touched.confirmPassword ? 'success' : null}
                                error={
                                    formik.errors.confirmPassword && formik.touched.confirmPassword
                                }
                                id="register-password-confirm"
                                label="confirmer le mot de passe"
                                variant="standard"
                                type="password"

                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: ICONS_COLOR }} />
                                        </InputAdornment>

                                    ),
                                }}

                                fullWidth
                                margin="dense"
                                name="confirmPassword"
                                {...formik.getFieldProps("confirmPassword")}

                                size={onSmallDevice ? "small" : "medium"}
                            />
                        </Box>

                    </Tooltip>

                    <Tooltip title={
                        formik.errors.acceptTerms && formik.touched.acceptTerms
                            ? formik.errors.acceptTerms
                            : null
                    }><Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
                            <Typography variant="body2">
                                <FormControlLabel
                                    required
                                    control={
                                        <Switch
                                            name="acceptTerms"
                                            {...formik.getFieldProps({
                                                name: "acceptTerms",
                                                checked: false,
                                            })}
                                        />
                                    }
                                    label={
                                        <>
                                            Accepter les
                                            <Link sx={{ color: ICONS_COLOR }} href="#terms" underline="hover">
                                                {" "}
                                                {`conditions d'utilisations`}
                                            </Link>
                                        </>
                                    }
                                />
                            </Typography>
                        </Box>

                    </Tooltip>

                    <Tooltip title={(!formik.isValid && 'tous les champs ne sont pas valides') || (formik.isSubmitting && 'validation en cours...')}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>

                            <Button size="medium" color="primary" disableElevation

                                variant="contained" type="submit" disabled={!formik.isValid || formik.isSubmitting} >
                                Créer le Compte
                            </Button>

                        </Box>


                        <Typography variant="body2" sx={{ color: 'red' }}>{signupError}</Typography>
                    </Tooltip>

                </form>
                {/*<Divider>
          <Chip label="vous possédez déja un compte ?" size="small" />
        </Divider> */}
                {/* <Typography variant="body2" sx={{ ...styles.text, justifyContent: 'flex-start' }}>
                    Déja un compte?
                    <Tooltip title={'Cliquer ICI pour vous connecter'} placement="top" arrow>
                        <Link component={"button"} underline="hover">
                            <RouterLinK to={'/login'} style={{ color: ICONS_COLOR, textDecoration: 'none' }}>
                                {`  Connectez-vous `}
                            </RouterLinK>


                        </Link>
                    </Tooltip>


                </Typography> */}
                <Divider sx={
                    {
                        color: ICONS_COLOR,
                        fontSize: '20px',
                        '&:after': {
                            border: `2px solid ${ICONS_COLOR}`
                        },
                        '&:before': {
                            border: `2px solid ${ICONS_COLOR}`
                        }
                    }}>
                    <Chip label="OU" size="medium" sx={{
                        // border: `2px solid ${ICONS_COLOR}`,
                        color: 'white',
                        backgroundColor: ICONS_COLOR


                    }} />
                </Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ ...styles.text, justifyContent: "flex-start", backgroundColor: '' }}>
                    <Tooltip title="se connecter avec Google" placement="top" arrow>
                        <IconButton onClick={async () => {
                            try {
                                 await signInWithPopup(auth, new GoogleAuthProvider())
                               
                                window.location.reload()
                            } catch (error) {
                                setSignupError(error.code)
                            }
                            

                        }}>
                            <Google color="primary" sx={{ color: 'red' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="se connecter avec Facebook" placement="top" arrow>
                        <IconButton  onClick={async () => {
                            try {
                                 await signInWithPopup(auth, new FacebookAuthProvider())
                               
                                window.location.reload()
                            } catch (error) {
                                setSignupError(error.code)
                            }
                            

                        }} >
                            <Facebook color="primary" sx={{ color: 'blue' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="recevoir un email de connexion" placement="top" arrow>
                        <IconButton  onClick={async () => {
                            try {
                                const email= window.prompt('veuillez saisir votre email pour recevoir le lien de connexion')
                                const actionCodeSettings = {
                                    url: window.location.href,
                                    handleCodeInApp: true,
                                };
                                sendSignInLinkToEmail(auth, email, actionCodeSettings)
                                    .then(() => {
                                        window.localStorage.setItem('emailForSignIn', email);
                                       
                                        toast.info(`lien de connexion envoyé à ${email}`, {
                                            delay: 1000,
                                            position:'top-center'
                                        })
                                       
                                    })
                                    .catch((error) => {
                                        setSignupError(error.code || error.message || error.statusText)
                        
                                    })


                                
                            } catch (error) {
                                setSignupError(error.code)
                            }
                            

                        }} >
                            <Email color="primary" sx={{ color: 'orange' }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="se connecter avec Twiter" placement="top" arrow>
                        <IconButton>
                            <Twitter color="primary" sx={{ color: 'skyblue' }} />
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
                </Box></Box>

            </Box>
        </Stack>
        // </ThemeProvider>

    );
}

export default SignupPage;
