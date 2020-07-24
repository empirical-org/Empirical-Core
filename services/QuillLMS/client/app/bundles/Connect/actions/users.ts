declare function require(name:string);
import  C from '../constants';
import rootRef, { firebase, config } from '../libs/firebase';
const users = rootRef.child('users');
import jwt_decode from 'jwt-decode'

export function firebaseAuth() {
  return (dispatch) => {
      const data = new FormData();
      data.append( "json", JSON.stringify( { app: config.projectId } ) );
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
              currentUser.getIdToken().then((token) => {
                // to do - something with this token
              });
            }
          }).catch((error) => {
            // to do - something with this error
          })
        })
    }
  }
