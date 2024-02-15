
import React from 'react'

import {  Fab, Stack} from '@mui/material';


import { Add } from '@mui/icons-material';

import { Link as RouterLink, useLoaderData } from "react-router-dom";

import PostCard from '../../../components/postCard';






function WelcomePage() {
  
 
   
  
 
  const initialData = useLoaderData();


  const postList = initialData.tabPosts
  const userList = initialData.tabUsers
  


  const createPostCardList = (postList = [], userList = []) => {
   
    const postCardList = postList.map((post) => {
      const postCard = {}
      postCard.title = post.title;
      postCard.id = post.pid;
      postCard.content = post.content;
      postCard.creationDate = post.completeDate;
      postCard.principalImage = post.imgURL;
      postCard.isOffLine = post.isOffline
      const user = userList.filter((user) => user.uid === post.authorId)
      postCard.userId = user[0]?.uid 
      
      postCard.userPseudo = user[0]?.pseudo || `BP_temp-user--${new Date().getTime().toString()}` ;
      postCard.userAvatar = user[0]?.photoURL;

      return postCard


    })
  

    return postCardList;
  }

    
    
   
  
  const postCardList = createPostCardList(postList, userList);
 

  
  

   

    return (
        <Stack spacing={1} >
            <RouterLink to={'addpost'}>
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

export default WelcomePage