import $ from 'jquery'
import firebase from 'firebase'

if (process.env.NODE_ENV === 'development' || process.env.FIREBASE_API_KEY) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  };

 firebase.initializeApp(config)

 let firebaseAccessed;

 firebase.database().ref('firebase_accessed').once('value')
   .then(function(snapshot) {
     firebaseAccessed = snapshot.val();
   }
 )

 setTimeout(
   ()=>{
     if (!firebaseAccessed) {
        alert('We\'ve detected that you may be experiencing firewall issues. Please go to Quill.org/firewall_help for more information.')
     }
   }, 5000
 )
}
