import $ from 'jquery'
import firebase from 'firebase'

$(document).ready(function(){
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
       $('body').prepend('<div class="flash error" onclick="$(this).slideUp(300)"><p>We\'ve detected that you may be experiencing firewall issues. If you\'re having trouble loading activities, please go <a href="/firewall_info">here</a> for more information.</p><i class="fa fa-times-circle" aria-hidden="true"></i></div>')
     }
   }, 3000
 )
}
})
