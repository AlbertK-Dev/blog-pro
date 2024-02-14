import {
  Avatar,
  Box,
  Tooltip,
  Typography,
 
  IconButton,
  Button,
  Divider,
  TextField,
  Link,
  Fab,
} from "@mui/material";
import React, {  useState } from "react";
import { useDimensions } from "../../../hooks/useDimensions";
import styles from "./style";
import {
  ArrowBack,
  Edit,
  Save,
  VerifiedOutlined,
 
} from "@mui/icons-material";
import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app, { dbPersist } from "../../../firebase/config";

import { ToastContainer, toast } from "react-toastify";
import useOnlineStatus from "../../../hooks/useOnlineStatus";
import {  green, red } from "@mui/material/colors";
import {  doc, onSnapshot, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { uActions } from "../../../redux/user/userSlice";
import { useLoaderData, Link as RouterLink } from "react-router-dom";
import validFileType from "../../../utlis/images/ValidateFileType";


const auth = getAuth(app);
const storage = getStorage();
const db = dbPersist
const updateDisplayName = (pseudo) =>
  updateProfile(auth.currentUser, { displayName: pseudo });
const updatePhotoURL = (photoURL) =>
  updateProfile(auth.currentUser, { photoURL });

  const updatePhotoInDB = (photoURL, uid) => {
    const userRef = doc(db, 'users', uid);
    setDoc(userRef, {  photoURL }, { merge: true });
}
  
const updatePseudoInDB = (pseudo, uid) => {
  
  const userRef = doc(db, 'users', uid);
  setDoc(userRef, {  pseudo }, { merge: true });
}

const updateStatusInDB = (status, uid) => {
  const userRef = doc(db, 'users', uid);
  setDoc(userRef, {  status }, { merge: true });
}



function UserField({
  fieldName,
  defaultValue,
  canEdit = false,
  verified = false,
  onSave,
  email = false,
  onVerify,
  ...textFieldProps
}) {
  const [editing, setEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(defaultValue);

  return (
    <Box
      sx={{
        ...styles.flexCenter,
        justifyContent: "space-between",
        gap: 1,
        margin: 2,
      }}
    >
      {fieldName}
      <TextField
        {...textFieldProps}
        fullWidth
        disabled={!editing}
        variant="standard"
        onChange={(e) => setFieldValue(e.target.value)}
        value={fieldValue}
        sx={{textAlign:'center'}}
      />
      {canEdit && (
        <IconButton disabled={editing} onClick={() => setEditing(true)}>
          <Edit />
        </IconButton>
      )}
      {canEdit && (
        <IconButton
          disabled={!editing}
          onClick={() => {
            setEditing(false);
            onSave(fieldValue);
          }}
        >
          <Save />
        </IconButton>
      )}
      {email && (
       
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            alignContent: "center",
              gap:2
            }}
          > <Tooltip
          title={verified ? "email vérifié" : "email non-vérifié"}
          placement='top-end'
        >
          {" "}
            <VerifiedOutlined
              sx={{ color: verified ? green[700] : red[700] }}
            />{" "}</Tooltip>
            {verified ? null : (
              <Tooltip title="cliquer pour vérifier" placement="right">
                <Button size="small" onClick={onVerify} variant="contained">
                  Vérifier
                </Button>
              </Tooltip>
            )}
          </Box>
        
      )}
    </Box>
  );
}

function UserInfosPages() {
  const { innerWidth } = useDimensions();
  const isOnline = useOnlineStatus();

  const user = auth.currentUser
  const primaryUser = useLoaderData()
  const [syncUser, setSyncUser] = useState(primaryUser)

  const onSmallDevice = innerWidth <= 500;
  const onMediumDevice = innerWidth <= 940;
  //const ICONS_COLOR = "#1976d2";

 

  const dispach = useDispatch()
  
  


    
    
    onSnapshot(doc(db, 'users', primaryUser.uid), (doc) => {
      
     const  userInfos = {
        ...doc.data(),
        uid: user.uid,
        password: 'invisible'
      }
      dispach(uActions.updateUserInfos(userInfos));
      setSyncUser(userInfos)
   })
        
        
  

  const handleChangePhoto = async (file) => {

    console.log(file)
   

    const toastID = toast.loading('modification de la photo de profile...');

    
      if (isOnline === false) {
        console.log("veuillez vous connecté à internet!");
      }


    
      try {
  
        //mise a jour de la photo de profile
        const userProfilePhotoRef = ref(storage, `users/${user.uid}/photo`);
  
        let photoURL = "";
  
        if (file === null || file === undefined) {
          
          toast.update(toastID, {
            type: 'error',
            isLoading: false,
            render: 'veuillez sélectionner une photo',
            autoClose: 1000,
            
          })
        } else if (validFileType(file) === false) {
          
          toast.update(toastID, {
            type: 'error',
            isLoading: false,
            render: `format d'image non-reconnu`,
            autoClose: 1000,
            
          })
        }
        else {
         await uploadBytes(userProfilePhotoRef, file);
          console.log("image envoyé");
          photoURL = await getDownloadURL(userProfilePhotoRef);
          console.log("url image : ", photoURL);
           await updatePhotoURL(photoURL);
          await updatePhotoInDB(photoURL,user.uid);
          toast.update(toastID, {
            type: 'success',
            isLoading: false,
            render:'photo modifier avec succès!'
          })
          setTimeout(() => {
            window.location.reload()
          }, 1000);
         // window.location.reload()
        }
        

      } catch (error) {
        toast.update(toastID, {
            type: 'error',
            isLoading: false,
            render:error.code
          })
       console.log(error.code);
      }
      
   
    }
  
  

  const handleChangePseudo = async (pseudo) => {
    const toastId = toast.loading('modification du pseudo');
    
      try {
        if (isOnline === false) {
          toast.update(toastId, {
            render: "veuillez vous connecté à internet!",
            isLoading: false,
            autoClose: 2000,
            type:'error'
            
          });
          setTimeout(() => {
            window.location.reload()
          }, 1000);
      }
        await updateDisplayName(pseudo);
        await updatePseudoInDB(pseudo,user.uid);
      toast.update(toastId, {
        render: "Pseudo modifié avec succès!",
        isLoading: false,
        autoClose: 1000,
        type:'success'
        
      });
      } catch (error) {
        toast.update(toastId, {
          render: `erreur : ${error.code || error.message || error.statuText}`,
          isLoading: false,
          autoClose: 2000,
          type:'error'
          
        });
      }
      
  }
  
  const handleChangeStatus = async (status) => {

    const toastId = toast.loading('modification du status');
    
    try {
      if (isOnline === false) {
        toast.update(toastId, {
          render: "veuillez vous connecté à internet!",
          isLoading: false,
          autoClose: 2000,
          type:'error'
          
        });
        setTimeout(() => {
          window.location.reload()
        }, 1000);
    }
     
      await updateStatusInDB(status, user.uid);
    toast.update(toastId, {
      render: "Status modifié avec succès!",
      isLoading: false,
      autoClose: 2000,
      type:'success'
      
    });
    } catch (error) {
      console.log(error)
      toast.update(toastId, {
        render: `erreur : ${error.code || error.message || error.statuText}`,
        isLoading: false,
        autoClose: 2000,
        type:'error'
        
      });
    }

  }

  const handleVerifyEmail = async () => {
   const toastId = toast.loading('lancement de la procédure...')
    
      try {
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings);
        toast.update(toastId, {
          render: `email de vérification envoyer à ${user.email}`,
          type: 'success',
          isLoading:false,
          position: 'top-center',
          autoClose:false
        })
        
        
      } catch (error) {
        toast.update(toastId, {
          render: `erreur :  ${error.code || error.message}`,
          type: 'error',
          position: 'top-center',
          isLoading:false,
          autoClose:2000
        })
        
        
      }

    }
  


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        //backgroundColor: "skyblue",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap:2
      }}
    >
      <Box>
        <ToastContainer limit={2} />
        <RouterLink to={-1} >
                    <Fab color='primary' sx={onSmallDevice || onMediumDevice ? { } : { ...styles.fab.sm, position:'fixed' }}> <ArrowBack /> </Fab>
            </RouterLink>
      <Typography
        variant="body1"
        sx={{
          display: "flex",
          border:'0px solid yellow',

          fontFamily: "Great Vibes",
          //fontFamily: "Playfair Display",
          fontSize: onSmallDevice?'30px':'40px',
          //fontWeight: "bold",
          //textShadow: `2px 2px 5px ${ICONS_COLOR}`,
          //textShadow: `2px 2px 5px ${blue[500]}`,
          color: "black",
          textDecoration: 'underline',
          justifyContent: "center",
          alignItems: "center",
          mb:'50px'
        }}
      >
        Vos Informations
        </Typography>
        
      </Box>
   
      <Box>
          <Box sx={{ ...styles.flexCenter,  }}>
        <Box
          sx={{
           ...styles.flexCenter,
            position: "relative",
            width: "100%",
            flexDirection: 'column',
            gap:2
          }}
        >
          <Link  href={user?.photoURL}><Avatar
            sx={{
              ...styles.avatar,
              width: onSmallDevice ? 150 : 200,
              height: onSmallDevice ? 150 : 200,
            }}
            className="photoPreview"
            alt="Photo De Profile"
            src={user?.photoURL ||'none'}
            /></Link>
             <Tooltip title="Modifier la photo de Profil">
            <Button
              size="small"
              endIcon={<Edit  />}
              component="label"
              variant="contained"
            >
              modifier La photo de  Profil
                <input type="file" onChange={(e) => handleChangePhoto(e.target.files[0])} style={{ height: 1, width: 0, overflow:'hidden'}} />
            </Button>
          </Tooltip>
         
          </Box>
          
        </Box>
         
       
        {/* <input type="file" onChange={(e)=> handleChangePhoto(e.target.files[0])}/> */}

      <Divider sx={{ m: 2 }} />
      <UserField
        fieldName={"Pseudo"}
        defaultValue={user?.displayName || "non-définit"}
        canEdit
        onSave={handleChangePseudo}
      />
      <UserField
        fieldName={"email"}
        defaultValue={user?.email || "albertk@gmail.com"}
        verified={user?.emailVerified}
        email
        onVerify={handleVerifyEmail}
        />
     <UserField fieldName={'statut '} defaultValue={syncUser.status || 'définir un statut'} canEdit onSave={handleChangeStatus}/>
      </Box>
    
    </Box>
  );
}

export default UserInfosPages;
