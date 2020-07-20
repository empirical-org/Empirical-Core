const prod = process.env.RAILS_ENV === 'production';

import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/performance';

let config = {};
if (prod) {
  config = {
    apiKey: "AIzaSyC6mYwIeRVh3B1d0fuvXH6oKekFtSCg-IE",
    authDomain: "quillconnect.firebaseapp.com",
    databaseURL: "https://quillconnect.firebaseio.com",
    projectId: "quillconnect",
    storageBucket: "quillconnect.appspot.com",
    messagingSenderId: "557046800359",
    appId: "1:557046800359:web:737be906050197d5"
  };
} else {
  config = {
    apiKey: "AIzaSyCb_V_wX_ftJNy6Q5x9NsuGrRvnC7_0zSU",
    authDomain: "quillgrammarstaging.firebaseapp.com",
    databaseURL: "https://quillgrammarstaging.firebaseio.com",
    projectId: "quillgrammarstaging",
    storageBucket: "quillgrammarstaging.appspot.com",
    messagingSenderId: "203764425036",
    appId: "1:203764425036:web:911597a615756d0d"
  };
}

firebase.initializeApp(config);
const perf = firebase.performance();

const rootRef = firebase.database().ref().child('v3');

export default rootRef;

export {
  firebase
};
