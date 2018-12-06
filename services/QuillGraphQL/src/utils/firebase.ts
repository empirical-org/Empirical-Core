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