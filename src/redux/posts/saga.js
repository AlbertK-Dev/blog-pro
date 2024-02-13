import { put, takeEvery, takeLatest } from "redux-saga/effects";
import * as types from './types'
import { pActions } from "./postsSlice";
import {  collection, collectionGroup, doc, getDoc, getDocs} from "firebase/firestore";
import app, { dbPersist } from "../../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const auth = getAuth(app);
const db = dbPersist

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
  return { date, time: atTime };
}




function* getPosts() {
    console.log('get all posts')
    
    try {
     const postsSnap = yield getDocs(collectionGroup(db, 'posts'))
     const tabPosts = [];
     postsSnap.forEach((doc) => {
        const info = doc.data()
        const isOffline = doc.metadata.hasPendingWrites;
        tabPosts.push({
            ...info,
            pid: doc.id,
            creationTime: convertTimeStamp(info.creationDate).time,
            creationDate: convertTimeStamp(info.creationDate).date,
            updateTime: convertTimeStamp(info.updateDate).time,
            updateDate: convertTimeStamp(info.updateDate).date,
            isOffline

        })
     })
        
    yield put(pActions.updateAllPost(tabPosts))
    
    } catch (error) {
        console.log(error.code||error.message||error.statusText)
    }
    
}

function* getAuthors() {
    console.log('get all authors')
    
    try {
        const usersSnap = yield getDocs(collection(db, 'users'))
     const tabUsers = [];
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
        
    yield put(pActions.updateAllAuthors(tabUsers))
    
    } catch (error) {
        console.log(error.code||error.message||error.statusText)
    }
    
}

function* resetPosts() {
    console.log('clear all posts')
    yield put(pActions.clearAll())
}


export default function* postsSaga() {
    yield takeEvery(types.GET_POSTS_REQUEST, getPosts)
    yield takeEvery(types.GET_ALL_AUTHORS, getAuthors)
    yield takeLatest(types.RESET_POSTS, resetPosts)
}


