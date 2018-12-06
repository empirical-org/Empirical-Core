import * as request from 'superagent'

declare interface FirebaseObject {
  id: string;
  [propName: string]: any;
}

export function embedIdInFirebaseObject(object: any, id: string):FirebaseObject {
  return Object.assign({}, object, {id});
}

declare interface FirebaseIndex {
  [id: string]: any
}

export function convertFirebaseIndexToFirebaseCollection(firebaseIndex:FirebaseIndex):FirebaseObject[] {
  return Object.keys(firebaseIndex).map((id) => {
    return embedIdInFirebaseObject(firebaseIndex[id], id)
  })
}

export function fetchFirebaseIndex(resourcePath:string):Promise<FirebaseObject[]> {
  return request
    .get(`${process.env.FIREBASE_URL}/${resourcePath}.json`)
    .then((res) => {
      return convertFirebaseIndexToFirebaseCollection(res.body)
    });
}

export function fetchFirebaseObject(resourcePath:string, objectId:string):Promise<FirebaseObject> {
  return request
    .get(`${process.env.FIREBASE_URL}/${resourcePath}/${objectId}.json`)
    .then((res) => {
      return embedIdInFirebaseObject(res.body, objectId);
    });
}