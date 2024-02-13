
import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyCpus7wdZEAs40nuClejwFWVeab7MVZNIk',
  authDomain: "blog-pro-c4b17.firebaseapp.com",
  projectId: "blog-pro-c4b17",
  storageBucket: "blog-pro-c4b17.appspot.com",
  messagingSenderId: 569815557931,
  appId: "1:569815557931:web:875ac87a93327cc28c476e"
};


const app = initializeApp(firebaseConfig);
 
export const dbPersist = initializeFirestore(app,
  {
      localCache:
      persistentLocalCache(/*settings*/{tabManager: persistentMultipleTabManager()})
})


export default app
 
