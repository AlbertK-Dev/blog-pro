
import React from 'react'

import {  Fab, Stack, Typography} from '@mui/material';


import { Add} from '@mui/icons-material';

import { Link as RouterLink, useLoaderData } from "react-router-dom";

import PostCard from '../../../components/postCard';
import { getAuth } from 'firebase/auth';
import app from '../../../firebase/config';
import { blueGrey } from '@mui/material/colors';
import styles from './style';





const auth = getAuth(app);
const userAuth = auth.currentUser

function UserPostsPage() {
  

 
 
  const initialData = useLoaderData();
  console.log(initialData)


  const postList = initialData.tabPosts
   
  const user = userAuth || initialData.user
  
  


  const createPostCardList = (postList = []) => {
   
    const postCardList = postList.map((post) => {
      const postCard = {}
      postCard.title = post.title;
      postCard.id = post.pid;
      postCard.content = post.content;
      postCard.creationDate = post.completeDate;
      postCard.principalImage = post.imgURL;
      postCard.isOffLine = post.isOffline
      
      postCard.userId = user.uid
      
      postCard.userPseudo = user?.displayName|| `BP_temp-user--${new Date().getTime().toString()}` ;
      postCard.userAvatar = user?.photoURL;

      return postCard


    })
  

    return postCardList;
  }

    
  if (initialData.tabPosts == null) {
    return <Stack spacing={2} justifyContent={'center'} alignContent={'center'} flexDirection={'column'} >
      
      
      <RouterLink to={'../addpost'}>
  <Fab color='primary' sx={{
    position: {xs: 'fixed',sm: 'fixed', md:'fixed'},
    top: {sm:'100px',md: '100px'},
    left: {sm: '205px', md:'300px'},
    bottom: {xs:"12px", sm:''},
    right: {xs:'12px', sm:''},
        }}> <Add/> </Fab>
      </RouterLink>

      <Typography
          variant="body1"
          sx={{
            ...styles.text,
            flexDirection:'column',
            fontFamily: "Poppins",
            fontSize: "30px",
            //fontWeight: "bold",
           // textShadow: `2px 2px 3px ${blue[700]}`,
           // textShadow: `2px 2px 5px blue`,
            color: blueGrey[500],
            //textDecoration: 'underline'
            textAlign:'center'
          }}
        >
        {` cher(e)`}
        <i>{user?.displayName || `BP_temp-user--${new Date().getTime().toString()}` }</i><br/>
           {`Vous n'avez encore rien publier  pour le moment, cliquer sur le bouton < + > pour commencer. '` }
        </Typography>

     


      </Stack>
  }  
   
  
  const postCardList = createPostCardList(postList);
 

  
  

   

    return (
        <Stack spacing={1} >
            <RouterLink to={'../addpost'}>
          <Fab color='primary' sx={{
            position: {xs: 'fixed',sm: 'fixed', md:'fixed'},
            top: {sm:'100px',md: '100px'},
            left: {sm: '205px', md:'300px'},
            bottom: {xs:"12px", sm:''},
            right: {xs:'12px', sm:''},
                }}> <Add/> </Fab>
        </RouterLink>

        {postCardList.map((postCard) => {
         
          return <PostCard
            title={postCard.title}
            content={postCard.content}
            principalImage={postCard.principalImage}
            userAvatar={postCard.userAvatar}
            creationDate={postCard.creationDate}
            userPseudo={postCard.userPseudo}
            isOffline={postCard.isOffLine}
            key={postCard.id}
            userId={postCard.userId}
          />
        })}
            
          
      </Stack>
    
  )
}

export default UserPostsPage