const prod = process.env.NODE_ENV === 'production';

import firebase from 'firebase';
let config = {};
if (prod) {
  config = {
    apiKey: 'AIzaSyC6mYwIeRVh3B1d0fuvXH6oKekFtSCg-IE',
    authDomain: 'quillconnect.firebaseapp.com',
    databaseURL: 'https://quillconnect.firebaseio.com',
    storageBucket: 'quillconnect.appspot.com',
  };
} else {
  config = {
    apiKey: 'AIzaSyAJNeVssNkcjNonREdRZ7gTyEDqmAfz7Go',
    authDomain: 'quilldiagnosticstaging.firebaseapp.com',
    databaseURL: 'https://quilldiagnosticstaging.firebaseio.com',
    storageBucket: 'quilldiagnosticstaging.appspot.com',
  };
}

firebase.initializeApp(config);

const rootRef = firebase.database().ref().child('v1');

export default rootRef;

export {
  firebase
};
