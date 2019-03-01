import * as request from 'superagent'
import { RESTDataSource } from 'apollo-datasource-rest'
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

export class FirebaseAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.FIREBASE_URL}/`
  }

  async getObject(resourcePath:string, objectId:string):Promise<FirebaseObject> {
    const data = await this.get(`${resourcePath}/${objectId}.json`)
    return embedIdInFirebaseObject(data.results, objectId);
  }

  async getIndex(resourcePath:string) {
    const data = await this.get(`${resourcePath}.json`)
    return convertFirebaseIndexToFirebaseCollection(data.results);
  }
}