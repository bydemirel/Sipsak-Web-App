// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore,collection,getDocs,onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE6zrDsnpo2aA7B7A5vM-IR1HuiYhD9HQ",
  authDomain: "sipsak.firebaseapp.com",
  databaseURL: "https://sipsak-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sipsak",
  storageBucket: "sipsak.appspot.com",
  messagingSenderId: "1045687232267",
  appId: "1:1045687232267:web:127b07de392e5a37d7e40e",
  measurementId: "G-6MWXYJH4Q7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Initialize Firebase
      
      const messaging = getMessaging(app);

      getToken(messaging, {
        vapidKey:
          "BNlzoxDa7tVZ0y_e_p5JgXG0SJ3eH8I3QiGBj1cScwJe0mqYjlif1aHYxvaHg0OtjVWnQlP3-eWLuWWV2PoFSF4",
      }).then((currentToken) => {
        if (currentToken) {
          
         console.log(currentToken)

          async function getCurrentUser(currentToken)
          {
            await setDoc(doc(db,'CurrentRestaurant','CurrentRestaurantDoc'),{
              web_token: currentToken
            })
          }

          getCurrentUser(currentToken)
          //console.log(getCurrentUser(db));

          return currentToken;
        } else {
          console.log("currentToken not found");
        }
      });
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
}


