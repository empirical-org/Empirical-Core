import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyC6mYwIeRVh3B1d0fuvXH6oKekFtSCg-IE",
    authDomain: "quillconnect.firebaseapp.com",
    databaseURL: "https://quillconnect.firebaseio.com",
    storageBucket: "quillconnect.appspot.com",
  };

firebase.initializeApp(config);

var rootRef = firebase.database().ref();

export default rootRef
