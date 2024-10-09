import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkkFF0XhNZeWuDmOfEhsgdfX1VBG7WTas",
  authDomain: "todo-app-demo-xxxxx.firebaseapp.com",
  projectId: "todo-app-demo-xxxxx",
  storageBucket: "todo-app-demo-xxxxx.appspot.com",
  messagingSenderId: "583229840076",
  appId: "1:583229840076:web:af6a87c24455bb0dca77ca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 添加错误处理
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.uid);
  } else {
    console.log('No user is signed in.');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});