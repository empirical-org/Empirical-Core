const prod = process.env.NODE_ENV === 'production';
import firebase from 'firebase';

let config = {};
if (prod) {
  config = {
    apiKey: 'AIzaSyC2AuCgUeBthS4Itw45UaLAooa6wvhyjGE',
    authDomain: 'quillgrammar.firebaseapp.com',
    databaseURL: 'https://quillgrammar.firebaseio.com',
    // storageBucket: 'quillgrammar.appspot.com',
  };
} else {
  config = {
    apiKey: 'AIzaSyCb_V_wX_ftJNy6Q5x9NsuGrRvnC7_0zSU',
    authDomain: 'quillgrammarstaging.firebaseapp.com',
    databaseURL: 'https://quillgrammarstaging.firebaseio.com',
    // storageBucket: 'quillgrammarstaging.appspot.com',
  };
}

firebase.initializeApp(config);

const rootRef = firebase.database().ref().child('v3');

export default rootRef;

export {
  firebase
};
