import React from 'react'

import {  Avatar, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography} from '@mui/material';


import {  ArrowBack, Delete, Edit, Favorite, Save } from '@mui/icons-material';

import {  useLoaderData, useNavigate } from "react-router-dom";

import PostCard from '../../../components/postCard';
import { useDimensions } from '../../../hooks/useDimensions';
import { getAuth } from 'firebase/auth';
import app from '../../../firebase/config';






function PostDetailPage() {
  const navigate = useNavigate()
  const { innerWidth } = useDimensions()
  const SMALL_DEVICE_WIDTH = 600
  const onSmallDevice = innerWidth <= SMALL_DEVICE_WIDTH;
  const auth = getAuth(app);
  const currentUser = auth.currentUser
  
 
    let userActions = [
        {
            icon: <ArrowBack />,
            name: 'retour',
            action:()=>navigate(-1)
        },
        { icon: <Favorite />, name: 'Ajouter aux favoris' },
        { icon: <Save />, name: 'Enregistrer' },
        
  ];
  
  const privateActions = [
    { icon: <Delete />, name: 'Supprimer' },
        { icon: <Edit />, name: 'Editer' },

  ]
  
 

  const { postData, authorData } = useLoaderData()
  
  if (currentUser.uid === authorData.uid) {
    userActions = [...userActions, ...privateActions]
    
  }


  
    const createPostCardData = (postData, authorData) => {

        const postCard = {}
      postCard.title = postData.title;
      postCard.id = postData.pid;
      postCard.content = postData.content;
      postCard.creationDate = postData.completeDate;
      postCard.principalImage = postData.imgURL;
    postCard.isOffLine = postData.isOffline;
    postCard.userId = authorData.uid 
      postCard.userPseudo = authorData.pseudo || authorData.email || `BP_temp-user--${new Date().getTime().toString()}` ;
        postCard.userAvatar = authorData.photoURL;
        postCard.details = {
            album: postData.album,
            tags: postData.tags,
            metadata: {
                creation: {
                    time: postData.creationTime,
                    date: postData.creationDate
                },
                update: {
                    time: postData.updateTime,
                    date: postData.updateDate
                }

            }
        }
     return postCard
 }


 

    
    
   
  

    const postCardData = createPostCardData(postData,authorData)
 

  
  

   

    return (
      <Stack spacing={1} >
        <Box  sx={{
            
            position: {xs: 'fixed',sm: 'fixed', md:'fixed'},
            top: {sm:'100px',md: '100px'},
          left: { sm: '205px', md: '300px' },
          maxHeight: '64px',
          maxWidth: '64px',
          backgroundColor: 'transparent',
            borderRadius:'50%',
            bottom: {xs:"16px", sm:''},
          right: { xs: '16px', sm: '' },
          zIndex:999999

            
        }}>  <SpeedDial
            sx={onSmallDevice?{ position: 'absolute', bottom:0, right:0, zIndex:4}:null}
                icon={<SpeedDialIcon   />}
                direction={onSmallDevice? 'up' :'down'}
               
                ariaLabel="SpeedDial playground example 222"
              >
                {userActions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                  />
                ))}
          </SpeedDial>
        </Box>
        
        <Box display={'flex'} gap={3} alignItems={'center'}>
          <Avatar src={authorData.photoURL} />
          <Typography sx={{fontWeight:'bold'}}>{postData.title}</Typography>

        </Box>

        <Box className={'postCardItem'} maxHeight={onSmallDevice?'450px':'550px'} sx={{overflowY:'auto', overflowX:'hidden'}}>
<PostCard 
            title={postCardData.title}
            content={postCardData.content}
            principalImage={postCardData.principalImage}
            userAvatar={postCardData.userAvatar}
            creationDate={postCardData.creationDate}
            userPseudo={postCardData.userPseudo}
            isOffline={postCardData.isOffLine}
            key={postCardData.id}
            userId={postCardData.userId}
              pid={postCardData.id}
              widthDetail
              details={postCardData.details}
            />  
        </Box>
          

        
            <h3>
                les commentaires s'afficheront ici
            </h3>  
          
      </Stack>
    
  )
}

export default PostDetailPage