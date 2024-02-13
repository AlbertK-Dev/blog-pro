
import React from 'react'

import {  Fab, Stack} from '@mui/material';

import { getAuth } from 'firebase/auth';
import app from '../../../firebase/config';
import { Add } from '@mui/icons-material';
import styles from './style';
import { useDimensions } from '../../../hooks/useDimensions';
import { Link as RouterLink, useLoaderData } from "react-router-dom";
// import { collection, collectionGroup,  onSnapshot, query } from 'firebase/firestore';
// import { useDispatch} from 'react-redux';
// import { pActions } from '../../../redux/posts/postsSlice';
import PostCard from '../../../components/postCard';


const auth = getAuth(app)
// const db = dbPersist

// function convertTimeStamp(time) {
//     const fireBaseTime = new Date(
//       time?.seconds * 1000 + time?.nanoseconds / 1000000
//     );
//     const dateOptions = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     // const timeOptions = {
//     //   timeZone: "UTC",
//     //   timeZoneName: "long",
//     //   hour12: true,
//     // };
//     const date = fireBaseTime.toLocaleDateString(
//       'fr-FR',
//       dateOptions
//     );
//     const atTime = fireBaseTime.toLocaleTimeString(
//       'fr-FR'
//     );
//     return { date, time: atTime };
// }



function WelcomePage() {
  const user = auth.currentUser
  console.log(user)
    const { innerWidth } = useDimensions();
  const onSmallDevice = innerWidth <= 500; 
  const onMediumDevice = innerWidth <= 940;
  //   const dispach = useDispatch()
  // const qAllPosts = query(collectionGroup(db, 'posts'));
  // const qAllUsers = query(collection(db, 'users'))
  const initialData = useLoaderData();
  //const [syncData, setSyncData] = useState(initialData)

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
      
      postCard.userPseudo = user[0].pseudo;
      postCard.userAvatar = user[0].photoURL;

      return postCard


    })
  

    return postCardList;
  }

    
    
    // onSnapshot(qAllPosts, (docsSnap) => {
    //     const tabPosts = [];
    //     docsSnap.forEach((doc) => {
    //         const info = doc.data()
    //         const isOffline = doc.metadata.hasPendingWrites;
    //         tabPosts.push({
    //             ...info,
    //             pid: doc.id,
    //             creationTime: convertTimeStamp(info.creationDate).time,
    //             creationDate: convertTimeStamp(info.creationDate).date,
    //             updateTime: convertTimeStamp(info.updateDate).time,
    //             updateDate: convertTimeStamp(info.updateDate).date,
    //             isOffline
    
    //         })
    //     })
    //   dispach(pActions.updateAllPost(tabPosts))
    //   setSyncData({...syncData, tabPosts})
        
    // })
  
    // onSnapshot(qAllUsers, (docsSnap) => {
    //   const tabUsers = [];
    //   docsSnap.forEach((doc) => {
    //       const info = doc.data()
    //       const isOffline = doc.metadata.hasPendingWrites;
    //     tabUsers.push({
    //       pseudo: info.pseudo,
    //       photoURL: info.photoURL,
    //       uid: doc.id,
    //       isOffline
     
    //       })
    //   })
    //   dispach(pActions.updateAllAuthors(tabUsers))
    //   setSyncData({...syncData, tabUsers})
      
    // })
  
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
          />
        })}
            
            {/* <Typography variant='button'>
                {`${user?.displayName || 'Albert'} - ${user?.email || 'albert@gmail.com'}`}
            </Typography>
            <div>Bienvenu dans l'ultra superbe app BLOG-PRO</div>
            <p>ici il y'aura une barre de recherche, un petit input type select (ou peut etre des chips avec des tags)</p>
            <p>puis tous les posts par page avec un breadcrumb</p> */}
      </Stack>
    
  )
}

export default WelcomePage