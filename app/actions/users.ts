declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const users = rootRef.child('users');
import request from 'request'

export function firebaseAuth() {
  return (dispatch) => {
    request.post({
      url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/firebase_tokens/create_for_connect`,
      json: { app: process.env.FIREBASE_APP_NAME}, },
      (error, httpStatus, body) => {
        if (body && body.token) {
          firebase.auth().signInWithCustomToken(body.token).catch(function(error) {
            console.log(error.message)
          })
        }
      });
  };
}
