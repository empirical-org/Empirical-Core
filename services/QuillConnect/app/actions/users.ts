declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase } from '../libs/firebase';
const users = rootRef.child('users');
import jwt_decode from 'jwt-decode'

export function firebaseAuth() {
  return (dispatch) => {
      const data = new FormData();
      data.append( "json", JSON.stringify( { app: process.env.FIREBASE_APP_NAME} ) );
      fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/firebase_tokens/create_for_connect`, {
        method: "POST",
        mode: "cors",
        credentials: 'include',
        body: data
      }).then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }).then((response) => {
          firebase.auth().signInWithCustomToken(response.token).then((firebaseResponse) => {
            const currentUser = firebase.auth().currentUser
            if (currentUser) {
              currentUser.getToken().then((token) => {
                console.log(jwt_decode(token));
              });
            }
          }).catch((error) => {
            console.log(error.message)
          })
        })
    }
  }
