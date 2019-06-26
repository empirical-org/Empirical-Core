const prod = process.env.NODE_ENV === 'production';

import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/performance';

let config = {};
if (prod) {
  config = {
    apiKey: 'AIzaSyC6mYwIeRVh3B1d0fuvXH6oKekFtSCg-IE',
    authDomain: 'quillconnect.firebaseapp.com',
    databaseURL: 'https://quillconnect.firebaseio.com',
    storageBucket: 'quillgrammar.appspot.com',
  };
} else {
  config = {
    apiKey: 'AIzaSyCb_V_wX_ftJNy6Q5x9NsuGrRvnC7_0zSU',
    authDomain: 'quillgrammarstaging.firebaseapp.com',
    databaseURL: 'https://quillgrammarstaging.firebaseio.com',
    storageBucket: 'quillgrammarstaging.appspot.com',
  };
}

firebase.initializeApp(config);
const perf = firebase.performance();

const rootRef = firebase.database().ref().child('v3');

export default rootRef;

export {
  firebase
};
