import $ from 'jquery';
import firebase from 'firebase';

if (process.env.RAILS_ENV === 'development' || process.env.FIREBASE_API_KEY) {
  const connectConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };

  const grammarConfig = {
    apiKey: process.env.FIREBASE_GRAMMAR_API_KEY,
    authDomain: process.env.FIREBASE_GRAMMAR_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_GRAMMAR_DATABASE_URL,
    storageBucket: process.env.FIREBASE_GRAMMAR_STORAGE_BUCKET,
  };

  const firebaseApps = [connectConfig, grammarConfig];

  let firebaseAccessedCount = 0;

  firebaseApps.forEach((app, index) => {
    const currentApp = firebase.initializeApp(connectConfig, `firebaseApp${index}`);
    currentApp.database().ref('firebase_accessed').once('value')
      .then((snapshot) => {
        if (snapshot.val() === true) {
          firebaseAccessedCount += 1;
        }
      });
  });

  setTimeout(() => {
    if (firebaseAccessedCount !== 2) {
      $('body').prepend('<div class="flash error" onclick="$(this).slideUp(300)"><p>We\'ve detected that you may be experiencing firewall issues. If you\'re having trouble loading activities, please go <a href="/firewall_info">here</a> for more information.</p><i class="fa fa-times-circle" aria-hidden="true"></i></div>');
    }
  }, 5000);
}
