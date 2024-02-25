import {
  
  RouterProvider,
  createBrowserRouter,
  defer,
  redirect,
} from "react-router-dom";
import React from "react";

import HomePage from "../pages/HomePage";
import ErrorPage from "../pages/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged /*,onAuthStateChanged*/,
  setPersistence,
} from "firebase/auth";
import app, { dbPersist } from "../firebase/config";

import SignupPage from "../pages/SignupPage";
import SigninPage from "../pages/SigninPage";
import UserInfosPages from "../pages/HomePage/Children/UserInfosPage";
import AddPostPage from "../pages/HomePage/Children/AddPostPage";
import {  collection, collectionGroup, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import ResetPassword from "../pages/ResetPassword";
import UserPostsPage from "../pages/HomePage/Children/UserPostsPage";
import Welcome from "../pages/HomePage/Children/Welcome";
import PostDetailPage from "../pages/HomePage/Children/PostDetailPage";




const auth = getAuth(app);
const db = dbPersist

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

async function getWelcomeData() {
  const postsSnap = await getDocs(collectionGroup(db, 'posts'))
  const usersSnap = await getDocs(collection(db, 'users'))
  return {postsSnap, usersSnap}
  
}

function getAuthStatus() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
}

export const mainRouter = createBrowserRouter([

  {
    path: "/",
    element: <HomePage />,
    loader: async () => {
      await setPersistence(auth, browserLocalPersistence);
      

      const user = await getAuthStatus();
      
      return user ?? redirect("/login");
    },
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Welcome />,
            loader: async () => {
              const user = await getAuthStatus();
            
              if (user == null) {
                return redirect('/login')
              }
              const welcomeData =  getWelcomeData()

              return defer({welcomeData});
            },
          },
          {
            path: "user",
            element: <UserInfosPages />,
            loader: async () => {
              const user = await getAuthStatus();
              
              
              const docRef = doc(db, 'users', user.uid)
              const docu = await getDoc(docRef);
              const userInf = {
                ...docu.data(),
                uid: user.uid,
                password: 'invisible'
              }
              await setDoc(docRef, {  pseudo: user.displayName }, { merge: true });
             
              return userInf
               

            }
              
              
          },
          {
            path: "posts",
            element: <UserPostsPage />,
            loader: async () => {
              const user = await getAuthStatus();
              if (user == null) {
                return redirect('/login')
              }
              const postsSnap = await getDocs(collection(db, 'users', user.uid, 'posts' ))
              
              
             
              const tabPosts = [];
              

              postsSnap?.forEach((doc) => {
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
              if (tabPosts.length === 0) {
                return {user, tabPosts:null}
              }
              
              //filtrons le tableau tabPosts
              tabPosts.sort((a,b)=> a.millisec - b.millisec).reverse()
              
              return { user,tabPosts};
            },
          },
          {
            path: "dashboard",
            element: (
              <h2>la page configuré essentiellement pour l'utilisateur</h2>
            ),
          },
          {
            path: "post/:postId",
            element: <PostDetailPage/>,
            loader: async ({params}) => {
              const postId = params.postId;
              const fakeTab = []
              const q = query( collectionGroup(db, 'posts') , where('pid','==',postId))
             
              const postSnap = await getDocs(q);
              postSnap.forEach((doc) => {
                const isOffline = doc.metadata.hasPendingWrites;
                const info = doc.data()
                fakeTab.push({
                  ...info,
                  isOffline,
                  creationTime: convertTimeStamp(info.creationDate).time,
                    creationDate: convertTimeStamp(info.creationDate).date,
                    updateTime: convertTimeStamp(info.updateDate).time,
                  updateDate: convertTimeStamp(info.updateDate).date,
                  completeDate: convertTimeStamp(info.updateDate).completDate,
                })
              })
              const authorRef = doc(db, 'users', fakeTab[0].authorId)
              const authorSnap = await getDoc(authorRef)
              const authorInfos = {
                ...authorSnap.data(),
                uid: authorSnap.id,
                password: 'invisible'
              }
              return {postData:fakeTab[0],authorData:authorInfos}
              

            }
          },
          {
            path: "addpost",
            element: (
              <AddPostPage/>
               
              
            ),
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },

  {
    path: "/register",
    element: <SignupPage />,
    loader: async () => {
      const user = await getAuthStatus();
     

      if (user != null) {
        return redirect("/");
      }

      return null;
    },
  },

  {
    path: "/login",
    element: <SigninPage />,
    loader: async () => {
      const user = await getAuthStatus();
      console.log("router login ", user);

      if (user != null) {
        return redirect("/");
      }
      return null;
    },
  },
  {
    path: "/reset-pwd",
    element: <ResetPassword/>,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);



function Router() {
  return <RouterProvider router={mainRouter}></RouterProvider>;
}

export default Router;
