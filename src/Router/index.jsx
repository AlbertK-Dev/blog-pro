import { Navigate, RouterProvider, createBrowserRouter, redirect } from "react-router-dom";
import React from 'react'

import EmailVerificator from "../pages/EmailVerificator";
import HomePage from "../pages/HomePage";
import ErrorPage from "../pages/ErrorPage";
import WelcomePage from "../pages/WelcomePage";
import NotFoundPage from "../pages/NotFoundPage";
import { browserLocalPersistence, getAuth, onAuthStateChanged, /*,onAuthStateChanged*/ 
setPersistence} from "firebase/auth";
import app from "../firebase/config";

import { getDownloadURL, getStorage, ref } from "firebase/storage";
import AuthPage from "../pages/AuthPage";

const auth = getAuth(app)
const storage = getStorage()
function getAuthStatus() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
        })
    })
}


const mainRouter = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={'/app'} />,
        errorElement: <ErrorPage />,
        loader: async () => {
            const auth = getAuth(app);
            await setPersistence(auth, browserLocalPersistence)
            console.log('local persistence set')
            return 0
  }
     

    },
    {
        path: '/auth',
        element : <AuthPage/>,
        loader: async () => {

            const user = await getAuthStatus()
            console.log('router login ',user)
            if (user != null) {
                   return     redirect('/app');
            }
            const userDefaultPhotoRef = ref(storage, 'users/default/avatarDefault.jpg');
            const urlDefault = await getDownloadURL(userDefaultPhotoRef);
            console.log('default photo : ', urlDefault)
            return urlDefault;
            
            
        },
    },

    {

        path: '/app',
        element: (<HomePage />),
        loader: async () => {

            const user = await getAuthStatus();
            console.log('router ',user)
            if (user == null) {
                   return     redirect('/pub');
            } else if ( user.providerData[0].providerId !== 'facebook.com' &&  user?.emailVerified === false) {
                console.log(user)
                console.log(user.providerData[0].providerId)
                    return    redirect('/emailVerificator');
                } else {
                        return user
            }
            
        },
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true, element: <WelcomePage />,
                        loader: async () => {

                            const user = await getAuthStatus();
                            console.log('router welcome ',user)
                            if (user == null) {
                                   return     redirect('/pub');
                                }else if (user?.emailVerified === false) {
                                    return    redirect('/emailVerificator');
                                } else {
                                        return user
                            }
                            
                        },

                    },
                    {
                        path: 'posts',
                        element: <><h1>page d'acceuil avec tous les posts</h1></>,

                    },
                    {
                        path: 'dashboard',
                        element: <h2>la page configuré essentiellement pour l'utilisateur</h2>
                    },
                    {
                        path: 'posts/:postId',
                        element: <h2> le post sélectionner avec tous les détails</h2>
                    },
                    {
                        path: 'addpost',
                        element: <h2>formulaire d'ajout de post- l'utilisateur sera redirigé vers /app/postid</h2>
                    },
                    {
                        path: '*',
                        element: <NotFoundPage/>
                    }
                ]
            }]
    },


    {
        path: '/emailVerificator',
        element: <EmailVerificator />,
        loader: async() => {

            const user = await getAuthStatus()
            console.log('router email verif ',user)
            if (user == null) {
                   return     redirect('/auth');
                }else if (user?.emailVerified === true) {
                    return    redirect('/app');
                } else {
                        return user.email
            }
            
        },
    },

 
    {
        path: '/visitor',
        element: <>
            <h1>visitor</h1>
            <div>une page affichant les posts et les liens de connections sans toutefois utiliser les infos d'un utilisateur</div>
        </>,
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }

])




function Router() {
    return (
        <RouterProvider router={mainRouter} >
        </RouterProvider>
    )
}

export default Router