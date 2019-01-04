import * as request from 'superagent'
import {
  embedIdInFirebaseObject,
  convertFirebaseIndexToFirebaseCollection,
  fetchFirebaseIndex,
  fetchFirebaseObject
} from '../utils/firebase'
declare interface Lesson {
  flag: string
  introURL: string
  name: string
  id?: string
}

export default {
  Query: {
    connectActivity: (_, {id}) => fetchFirebaseObject('v2/lessons', id),
    connectActivities: () => fetchFirebaseIndex('v2/lessons')
  }
}
 