import {
  
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import React from "react";

import HomePage from "../pages/HomePage";
import ErrorPage from "../pages/ErrorPage";
import WelcomePage from "../pages/HomePage/Children/WelcomePage";
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
import {  collection, collectionGroup, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import ResetPassword from "../pages/ResetPassword";
import UserPostsPage from "../pages/HomePage/Children/UserPostsPage";




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
  //     {
  //         path: '/',
  //         element: <Navigate to={'/app'} />,
  //         errorElement: <ErrorPage />,
  //         loader: async () => {
  //             const auth = getAuth(app);
  //             await setPersistence(auth, browserLocalPersistence)
  //             console.log('local persistence set')
  //             return 0
  //   }

  //     },
  // {
  //     path: '/auth',
  //     element: <AuthPage />,

  //     loader: async () => {

  //         const user = await getAuthStatus()
  //         console.log('router login ',user)
  //         if (user != null) {
  //                return     redirect('/app');
  //         }
  //         const userDefaultPhotoRef = ref(storage, 'users/default/avatarDefault.jpg');
  //         const urlDefault = await getDownloadURL(userDefaultPhotoRef);
  //         console.log('default photo : ', urlDefault)
  //         return urlDefault;

  //     },
  // },

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
            element: <WelcomePage />,
            loader: async () => {
              const user = await getAuthStatus();
              if (user === null || user === undefined) {
                return redirect('/login')
              }
              const postsSnap = await getDocs(collectionGroup(db, 'posts'))
              const usersSnap = await getDocs(collection(db, 'users'))
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
              
              return { user,tabPosts, tabUsers};
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
            element: <h2> le post sélectionner avec tous les détails</h2>,
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
      console.log("router register ", user);

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

// export const designRouter = createBrowserRouter([
//     {

//         path: '/',
//         element: (<HomePage/>),
//         loader: async () => {

//             const user = { displayName: 'Albert', email: 'albert@gmail.com', emailVerified: true}
//             console.log('router ',user)
//             return user

//         },
//         children: [
//             {
//                 errorElement: <ErrorPage />,
//                 children: [
//                     {
//                         index: true,
//                         element: <WelcomePage />,

//                     },
//                     {
//                         path: 'posts',
//                         element: <><h1>page d'acceuil avec tous les posts</h1></>,

//                     },
//                     {
//                         path: 'user',
//                         element:<UserInfosPages/>

//                     },
//                     {
//                         path: 'dashboard',
//                         element: <h2>la page configuré essentiellement pour l'utilisateur</h2>
//                     },
//                     {
//                         path: 'posts/:postId',
//                         element: <h2> le post sélectionner avec tous les détails</h2>
//                     },
//                     {
//                         path: 'addpost',
//                         element: <h2>formulaire d'ajout de post- l'utilisateur sera redirigé vers /app/postid</h2>
//                     },
//                     {
//                         path: '*',
//                         element: <NotFoundPage/>
//                     }
//                 ]
//             }]
//     },
//     {
//         path: '/register',
//         element: <SignupPage />,
//     },
//     {
//         path: '/login',
//         element: <SigninPage/>
//     },
//     {
//         path: '/reset-pwd',
//         element: <h1>vous avez cliquez sur reset password?</h1>
//     },
//     {
//         path: '*',
//         element: <h1>Page non-trouver</h1>
//     }
// ])

function Router() {
  return <RouterProvider router={mainRouter}></RouterProvider>;
}

export default Router;
