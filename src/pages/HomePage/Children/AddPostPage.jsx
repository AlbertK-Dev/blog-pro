
import React, { useState } from 'react'

import { Box, Button, Chip, Fab, IconButton, ImageList, ImageListItem, ImageListItemBar, ListSubheader, TextField, Typography, styled } from '@mui/material';

import { getAuth } from 'firebase/auth';
import app, { dbPersist } from '../../../firebase/config';
import { Add, AddAPhoto, AddToPhotos, ArrowBack, Delete, Deselect } from '@mui/icons-material';
import styles from './style';
import { useDimensions } from '../../../hooks/useDimensions';
import {  Link as RouterLink} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { pActions } from '../../../redux/posts/postsSlice';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import validFileType from '../../../utlis/images/ValidateFileType';
import { useNavigate } from "react-router-dom";




const auth = getAuth(app)
const storage = getStorage()
const db = dbPersist

const createLocalImgUrl = (file) => {
    if (file === null || file === undefined) {
        return null    
    }
   
    return  window.URL.createObjectURL(file);

    
}

const createPostInDB = async (postData, userId) => {
    const userDocRef = doc(db, 'users', userId);
    const postDocRef = await addDoc(collection(userDocRef, 'posts'), postData)
    return postDocRef.id
}



//setImgChoozen(window.URL.createObjectURL(e.target.files[0]).toString());

function AddPostPage() {
    const user = auth.currentUser
    console.log(user)
    const MAX_TAGS = 5;
    const { innerWidth } = useDimensions();
    const postImgfile = useSelector((state) => state.posts.currentAddPostData?.postImgfile);
    const othersImagesFiles = useSelector((state) => state.posts.currentAddPostData?.othersImagesFiles);
    const otherImageTemp = useSelector((state) => state.posts.currentAddPostData?.otherImageTemp);
    const otherImageTempLegend = useSelector((state) => state.posts.currentAddPostData.otherImageTempLegend);
    const title = useSelector((state) => state.posts.currentAddPostData?.title);
    const content = useSelector((state) => state.posts.currentAddPostData?.content);
    const tags = useSelector((state) => state.posts.currentAddPostData.tags);
    const currentTag = useSelector((state) => state.posts.currentAddPostData.currentTag);
    
   
    const dispach = useDispatch()

    const [publication, setPublication] = useState(false)
    const navigate = useNavigate()

    const onSmallDevice = innerWidth <= 500;
    const onMediumDevice = innerWidth <= 940;
    const defaultPostImgLink = './postImgDefault.jpg';
 
 

    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });


    const handlecreatePost = async () => {
        setPublication(true)
        const createPostToast = toast.loading('publication en cours...', { position: 'top-right' })
        try {
            
            if (title === null || title === '' || title === undefined) {
                throw new Error('Veuillez définir un titre!')
                
            }
            if (content === null || content === '' || content === undefined ) {
                throw new Error('Veuillez définir un contenu!')
                
            }

            if (title.length < 5) {
                throw new Error('le titre doit contenir au moins 05 caractères')
                
            }
            if (content.length < 15) {
                throw new Error('le contenu doit avoir au moins 15 caractères')
                
            }
             let imgURL = ''
            const userImagePostRef = ref(storage, `users/${user.uid}/posts/${user.uid.concat(title.toLowerCase().replace(/\s+/g, ""))}/images/principal`)
            if (postImgfile === null || postImgfile === undefined) {
                toast.update(createPostToast,{
                    type: 'info',
                    isLoading: true,
                    render: `pas d'image principale`
                    
                  })
                
            } else {
                
                toast.update(createPostToast,{
            type: 'info',
            isLoading: true,
                    render: `upload de l'image principale`
                })
                await uploadBytes(userImagePostRef, postImgfile)
                imgURL = await getDownloadURL(userImagePostRef)
                
            }
        
            let album = []

            if (othersImagesFiles.length === 0) {

                toast.update(createPostToast,{
                    type: 'info',
                    isLoading: true,
                    render: `aucune image suplémentaire...`
                    
                  })
                
            } else {

                 album = await Promise.all(othersImagesFiles.map(async (imgfile, index) => {
            const userOthersImagesPostRef = ref(storage, `users/${user.uid}/posts/${user.uid.concat(title.toLowerCase().replace(/\s+/g, ""))}/images/others/${index}`)
            toast.update(createPostToast,{
                type: 'info',
                isLoading: true,
                render: `upload des autres images -> ${index + 1}`
                
              })
            await uploadBytes(userOthersImagesPostRef, imgfile.file)

            const imgURL = await getDownloadURL(userOthersImagesPostRef)
            console.log(imgURL)
            return {imgURL, legend: imgfile.legend}
        }))
            }
           
            
        
            
        const authorId = user.uid;
        const creationDate = serverTimestamp();
            const updateDate = serverTimestamp();
            

        const postData = {
            title,
            content,
            imgURL,
            authorId,
            album,
            tags,
            creationDate,
            updateDate,
        }
        toast.update(createPostToast,{
            type: 'info',
            isLoading: true,
            render: 'finalisation...'
            
        })
        await createPostInDB(postData, user.uid);
        toast.update(createPostToast,{
            type: 'success',
            isLoading: false,
            render: 'publication terminé!',
            autoClose:1000
            
        })
            
            dispach(pActions.resetCurrentAddPostData())
            navigate(-1)
            
            
        } catch (error) {
            console.log(error)
            toast.update(createPostToast,{
                type: 'error',
                isLoading: false,
                render: `erreur ${error.code || error.message || error.statusText}`,
                autoClose:1000
                
            })
            setPublication(false)
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
                gap: 1,
                position:'relative'
              
            }}
        >
            <Box>
                <RouterLink to={-1} >
                    <Fab color='primary' sx={{
            position: {xs: 'fixed',sm: 'fixed', md:'fixed'},
            top: {sm:'100px',md: '100px'},
            left: {sm: '205px', md:'300px'},
            bottom: {xs:"12px", sm:''},
            right: {xs:'12px', sm:''},
                }}> <ArrowBack /> </Fab>
            </RouterLink>
            <Box> {/** title */}
                <ToastContainer limit={2} />
                <Typography
                    variant="body1"
                    sx={{
                        display: "flex",
                        border: '0px solid yellow',

                        fontFamily: "Great Vibes",
                        //fontFamily: "Playfair Display",
                        fontSize: onSmallDevice ? '30px' : '40px',
                        //fontWeight: "bold",
                        //textShadow: `2px 2px 5px ${ICONS_COLOR}`,
                        //textShadow: `2px 2px 5px ${blue[500]}`,
                        color: "black",
                        textDecoration: 'underline',
                        justifyContent: "center",
                        alignItems: "center",
                        //mb: '50px'
                    }}
                >
                    Créer une publication
                </Typography>

            </Box>
            </Box>
            

            <Box>{/**image principal */}
                <Box>
                    <Box component='img' src={createLocalImgUrl(postImgfile) || defaultPostImgLink} alt='image' width="100%" height="200px" sx={{ backgroundSize: 'cover', borderRadius: '4px', objectFit:'fill' }} />
                    <Typography variant='body2'>{ }</Typography>
                </Box>
              
     
                <Box display={'flex'} gap={1} justifyContent={'space-between'}>{/**Button d'ajout de l'image */}
                    
                        <Button
                            size="small"
                            endIcon={<AddAPhoto />}
                            component="label"
                            variant="contained"
                        >
                            choisir une image
                        <VisuallyHiddenInput
                            className="inputPhoto"
                            onChange={(e) => {
                                if (e.target.files.length === 0) {
                                    toast.error('Selectionnez une image!', { position: 'top-right', autoClose: 1000 })
                                    return;
                                }
                                if (validFileType(e.target.files[0]) === false) {
                                    toast.error(`formet d'image inconnu!`, { position: 'top-right', autoClose: 1000 })
                                    return;
                                    
                                }
                                
                                dispach(pActions.updateCurrentAddPostData({postImgfile: e.target.files[0]}))

                            }}
                            
                                type="file"
                                accept="image/png, image/jpeg"
                                //capture='user'
                                name="photopost"
                            />
                        </Button>
                    
                   
                        <Button
                            size="small"
                            endIcon={<Deselect />}
                            component="label"
                        variant="contained"
                        onClick={()=>  dispach(pActions.updateCurrentAddPostData({postImgfile: null}))}
                        >
                            laisser l'image vide
                           
                        </Button>
                    
                </Box>



            </Box>


            <Box  > {/** données de post */}

                <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                    <TextField
                        
                        size={"small"}
                        
                        name="title"
                        onChange={(e)=>  dispach(pActions.updateCurrentAddPostData({title: e.target.value}))}

                        margin="normal"
                        id="addpost-title"
                        type="text"
                        fullWidth
                        value={title}
                        label="Titre"
                        placeholder='brève description de votre publication'
                        variant="outlined"
                    />{" "}
                </Box>
                <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>
                    <TextField
                        
                        size={"small"}
                        onChange={(e)=> dispach(pActions.updateCurrentAddPostData({content: e.target.value}))}
                        name="content"
                        id="addpost-content"
                        margin='normal'
                        type='text'
                        label="contenu"
                        value={content}
                        placeholder="une information? une question? une remarque?"
                        fullWidth
                        multiline
                        maxRows={7}
                    />
                </Box>
                <Box> {/** tags */}
                    <Box display={'flex'}>{/**input bar */}
                        <TextField size='small' label={'Ajouter des étiquettes pour faciliter la recherche'} disabled={tags.length >= MAX_TAGS} name='currentTag' value={currentTag} fullWidth onChange={(e) => dispach(pActions.updateCurrentAddPostData({ currentTag: e.target.value }))} />
                        <IconButton color='primary' disabled={tags.length >= MAX_TAGS} onClick={() => {

                            if (currentTag === '') {
                                return;
                            }
                            dispach(pActions.updateCurrentAddPostData({ tags: [...tags, currentTag] }))
                            dispach(pActions.updateCurrentAddPostData({ currentTag: '' }))
                        }}><Add /> </IconButton>
                    </Box>
                    <Box width={'100%'} display={'flex'} flexWrap={'wrap'} gap={2} sx={{padding:2}}>{/**tags contaner  */}
                        {tags.map((tag, index) => <Chip label={tag} onDelete={() => dispach(pActions.updateCurrentAddPostData({ tags: tags.filter((x, i) => i !== index) }))} />
                        )}

                    </Box>


                </Box>
                


            </Box>


            <Button
                            size="small"
                            endIcon={<AddToPhotos />}
                            component="label"
                            variant="contained"
                        >
                            Plus d'images?
                        <VisuallyHiddenInput
                            className="inputPhoto"
                            onChange={(e) => {
                                if (e.target.files.length === 0) {
                                    toast.error('Selectionnez une image!', { position: 'top-right', autoClose: 1000 })
                                    return;
                                }
                                if (validFileType(e.target.files[0]) === false) {
                                    toast.error(`formet d'image inconnu!`, { position: 'top-right', autoClose: 1000 })
                                    return;
                                    
                                }
                               
                                dispach(pActions.updateCurrentAddPostData({otherImageTemp: e.target.files[0]}))
                            }}
                            
                                type="file"
                                accept="image/png, image/jpeg"
                                //capture='user'
                                name="imagetemp"
                            />
            </Button>
            {othersImagesFiles.length !== 0 && <Box> {/**other images viewer */}
            <ImageList sx={{ width: '100%', height: 400 }}>
      <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">autres images</ListSubheader>
      </ImageListItem>
      {othersImagesFiles.map((item, index) => (
        <ImageListItem key={item.img}>
              <Box
                  component={'img'}
                  width={'100%'}
                  height={'200px'}
            src={createLocalImgUrl(item.file)}
            alt={item.legend}
            loading="lazy"
          />
              <ImageListItemBar
                  sx={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
                  title={item.legend}
                 // position='bellow'
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    aria-label={`delete ${item.legend}`}
                    onClick={() =>  dispach(pActions.updateCurrentAddPostData({ othersImagesFiles: othersImagesFiles.filter((x, i) => i !== index) }))}
              >
                <Delete />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>

            </Box>}
            
            
            {otherImageTemp != null && <Box sx={{ ...styles.flexCenter, flexDirection:'column', height:'100%', width:'100%',position:'absolute', backgroundColor:'white', zIndex:'100'}}>

                <Box width={'95%'}>
                    <Box component={'img'} src={createLocalImgUrl(otherImageTemp) || 'none'} width={'100%'} maxHeight={'500px'} />
                    <Box sx={{ ...styles.boxField, alignItems: "baseline" }}>

                    <TextField
                       
                        size={"small"}
                        name="legend"

                        margin="normal"
                        id="addpost-other-image-legend"
                        type="text"
                            fullWidth
                            value={otherImageTempLegend}
                        label="légende"
                            onChange={(e)=> dispach(pActions.updateCurrentAddPostData({otherImageTempLegend: e.target.value}))}
                            variant="outlined"
                            multiline
                        />{" "}
                        
                        
                    </Box>
                    <Box sx={{ ...styles.flexCenter, justifyContent: 'space-between', width: '100%' }}>
                        
                        <Button variant='contained'
                            onClick={() => {
                           
                           dispach(pActions.updateCurrentAddPostData({otherImageTemp: null}))
                           dispach(pActions.updateCurrentAddPostData({otherImageTempLegend: ''}))
                            
                            }}>Annuler</Button>
                        <Button variant='contained' onClick={() => {
                            dispach(pActions.updateCurrentAddPostData({othersImagesFiles: [...othersImagesFiles, { file: otherImageTemp, legend: otherImageTempLegend }]}));
                            dispach(pActions.updateCurrentAddPostData({otherImageTemp: null}))
                           dispach(pActions.updateCurrentAddPostData({otherImageTempLegend: ''}))
                           
                        }}>Ajouter</Button>
                        
                        </Box>
            </Box>
                


                  
            </Box>}
            
            <Box sx={{width:'100%', ...styles.flexCenter, gap:1}}> {/**Final Buttons */}
                
                <Button disabled={publication} onClick={()=> dispach(pActions.resetCurrentAddPostData())} variant='contained' fullWidth>
                    Annuler
                </Button>
                <Button disabled={publication} onClick={handlecreatePost} variant='contained' fullWidth>
                    terminer
                </Button>


            </Box>

        </Box>



    )
}

export default AddPostPage