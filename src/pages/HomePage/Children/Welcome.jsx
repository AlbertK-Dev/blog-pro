import React, { Suspense } from 'react'

import {  Fab, Stack} from '@mui/material';


import { Add } from '@mui/icons-material';

import { Await, Link as RouterLink, useLoaderData } from "react-router-dom";

import PostCard from '../../../components/postCard';
import WelcomePageSkeleton from './sKeletons/WelcomePageSkeleton';

function convertTimeStamp(time) {
  const fireBaseTime = new Date(
    time?.seconds * 1000 + time?.nanoseconds / 1000000
  );
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // const timeOptions = {
  //   timeZone: "UTC",
  //   timeZoneName: "long",
  //   hour12: true,
  // };
  const date = fireBaseTime.toLocaleDateString(
    'fr-FR',
    dateOptions
  );
  const atTime = fireBaseTime.toLocaleTimeString(
    'fr-FR'
  );
  const complet = fireBaseTime.getTime();
  const completeDate = fireBaseTime.toLocaleString('fr-FR')

  return { date, time: atTime, millisec: complet, completDate: completeDate };
}





function Welcome() {
  
 
   
  
  const createInitialData = (postsSnap, usersSnap) => {

    const tabPosts = [];
    const tabUsers = [];

    postsSnap.forEach((doc) => {
      const info = doc.data()
      //  const isOffline = doc.metadata.hasPendingWrites;
      const isOffline = doc.metadata.fromCache
      tabPosts.push({
          ...info,
          pid: doc.id,
          creationTime: convertTimeStamp(info.creationDate).time,
          creationDate: convertTimeStamp(info.creationDate).date,
          updateTime: convertTimeStamp(info.updateDate).time,
        updateDate: convertTimeStamp(info.updateDate).date,
        completeDate: convertTimeStamp(info.updateDate).completDate,
          millisec: convertTimeStamp(info.updateDate).millisec,
          isOffline

      })
    })
  
    
    usersSnap.forEach((doc) => {
      const info = doc.data()
      const isOffline = doc.metadata.hasPendingWrites;
    tabUsers.push({
      pseudo: info.pseudo,
      photoURL: info.photoURL,
      uid: doc.id,
      isOffline
 
      })
    })
    //filtrons le tableau tabPosts
    tabPosts.sort((a,b)=> a.millisec - b.millisec).reverse()
    return { tabPosts, tabUsers};
  
}

  const data = useLoaderData()
 
  



  
  


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
      
      postCard.userPseudo = user[0]?.pseudo || user[0]?.email || `BP_temp-user--${new Date().getTime().toString()}` ;
      postCard.userAvatar = user[0]?.photoURL;

      return postCard


    })
  

    return postCardList;
  }

    
    
   
  

 

  
  

   

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
        

        <Suspense fallback={<WelcomePageSkeleton />}>
          <Await resolve={data.welcomeData  } errorElement={
            <p>Error loading data!</p>
          } >
            
            {
              ({postsSnap, usersSnap}) => {
                
                const initialData = createInitialData(postsSnap, usersSnap);
               


                const postList = initialData.tabPosts
                const userList = initialData.tabUsers
                const postCardList = createPostCardList(postList, userList);
                

                return postCardList?.map((postCard) => {
         
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
                    pid={postCard.id}
                  />
                })
              }
            }




          </Await>

        </Suspense>

      
            
          
      </Stack>
    
  )
}

export default Welcome