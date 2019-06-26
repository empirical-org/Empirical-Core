const prod = process.env.NODE_ENV === 'production';

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
    apiKey: 'AIzaSyAJNeVssNkcjNonREdRZ7gTyEDqmAfz7Go',
    authDomain: 'quillconnectstaging.firebaseapp.com',
    databaseURL: 'https://quillconnectstaging.firebaseio.com',
    storageBucket: 'quillconnectstaging.appspot.com',
  };
}
config = {
  apiKey: "AIzaSyC6mYwIeRVh3B1d0fuvXH6oKekFtSCg-IE",
  authDomain: "quillconnect.firebaseapp.com",
  databaseURL: "https://quillconnect.firebaseio.com",
  projectId: "quillconnect",
  storageBucket: "quillconnect.appspot.com",
  messagingSenderId: "557046800359",
  appId: "1:557046800359:web:737be906050197d5"
};

firebase.initializeApp(config);
const perf = firebase.performance();

const rootRef = firebase.database().ref().child('v2');

export default rootRef;

export {
  firebase
};
