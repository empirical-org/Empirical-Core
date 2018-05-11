declare function require(name:string);
import rootRef, { firebase } from '../libs/firebase';
const editionQuestionsRef = rootRef.child('lesson_edition_questions');
const editionMetadataRef = rootRef.child('lesson_edition_metadata');
const classroomLessonsRef = rootRef.child('classroom_lessons');
import C from '../constants';
import * as CustomizeIntf from '../interfaces/customize'
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates'

export function getCurrentUserAndCoteachersFromLMS() {
  return function(dispatch) {
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/users/current_user_and_coteachers`, {
      method: "GET",
      mode: "cors",
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        console.log(response.statusText)
      } else {
        return response.json()
      }
    }).then(response => {
      if (response && response.user) {
        dispatch(setUserId(response.user.id))
        dispatch(setCoteachers(response.coteachers))
      }
    })
  }
}

export function getEditionsForUserIds(userIds:Array<Number>, lessonID:string) {
  return function (dispatch, getState) {
    editionMetadataRef.orderByChild("lesson_id").equalTo(lessonID).on('value', (snapshot) => {
      dispatch(filterEditionsByUserIds(userIds, snapshot.val()))
    });
  };
}

export function startListeningToEditionMetadata() {
  return function (dispatch, getState) {
    editionMetadataRef.on('value', (snapshot) => {
      dispatch(setEditionMetadata(snapshot.val()))
    });
  };
}

export function getEditionQuestions(editionID:string) {
  return function (dispatch, getState) {
    editionQuestionsRef.child(editionID).on('value', (snapshot) => {
      if (snapshot.val()) {
        dispatch(setEditionQuestions(snapshot.val()))
      }
    });
  };
}

export function clearEditionQuestions() {
  return function(dispatch, getState) {
    dispatch(setEditionQuestions({}))
  }
}

export function createNewEdition(editionUID:string|null, lessonUID:string, user_id:Number|string, classroomActivityId?:string, callback?:any) {
  let newEditionData, newEdition;
  if (editionUID) {
    newEditionData = {lesson_id: lessonUID, edition_id: editionUID, user_id: user_id}
    newEdition = editionMetadataRef.push(newEditionData)
      editionQuestionsRef.child(`${editionUID}`).once('value', snapshot => {
      editionQuestionsRef.child(`${newEdition.key}`).set(snapshot.val())
    })
  } else {
    newEditionData = {lesson_id: lessonUID, user_id: user_id}
    newEdition = editionMetadataRef.push(newEditionData)
      classroomLessonsRef.child(lessonUID).once('value', snapshot => {
      editionQuestionsRef.child(`${newEdition.key}/questions`).set(snapshot.val().questions)
    })
  }
  if (callback) {
    callback(lessonUID, newEdition.key, classroomActivityId)
  } else {
    return newEdition.key
  }
}

export function createNewAdminEdition(editionUID:string|null, lessonUID:string, user_id:Number|string, callback?:any, name?:string) {
  let newEditionData, newEdition;
  if (editionUID) {
    newEditionData = {lesson_id: lessonUID, edition_id: editionUID, user_id: user_id, name: name, flags: ['alpha']}
    newEdition = editionMetadataRef.push(newEditionData)
      editionQuestionsRef.child(`${editionUID}`).once('value', snapshot => {
      editionQuestionsRef.child(`${newEdition.key}`).set(snapshot.val())
    })
  } else {
    newEditionData = {lesson_id: lessonUID, user_id: user_id, name: name, flags: ['alpha']}
    newEdition = editionMetadataRef.push(newEditionData)
      classroomLessonsRef.child(lessonUID).once('value', snapshot => {
        const questions = snapshot.val().questions ? snapshot.val().questions : [lessonSlideBoilerplates['CL-LB'], lessonSlideBoilerplates['CL-EX']]
        editionQuestionsRef.child(`${newEdition.key}/questions`).set(questions)
    })
  }
  if (callback) {
    callback(lessonUID, newEdition.key)
  } else {
    return newEdition.key
  }
}

export function saveEditionName(editionUID:string, name:string) {
  editionMetadataRef.child(`${editionUID}/name`).set(name)
}

export function archiveEdition(editionUID:string) {
  const flagRef = editionMetadataRef.child(`${editionUID}/flags`)
  flagRef.once('value', (snapshot) => {
    if (!snapshot.val()) {
      flagRef.set(['archived'])
    } else {
      const newFlags = snapshot.val().push('archived')
      flagRef.set(newFlags)
    }
  })
}

export function deleteEdition(editionUID:string) {
  editionMetadataRef.child(editionUID).remove()
  editionQuestionsRef.child(editionUID).remove()
}

export function setWorkingEditionQuestions(questions:CustomizeIntf.EditionQuestions) {
  return { type: C.SET_WORKING_EDITION_QUESTIONS, questions };
}

export function setWorkingEditionMetadata(metadata:CustomizeIntf.EditionMetadata) {
  return { type: C.SET_WORKING_EDITION_METADATA, metadata };
}

export function setIncompleteQuestions(incompleteQuestions:Array<number>|never) {
  return { type: C.SET_INCOMPLETE_QUESTIONS, incompleteQuestions };
}

export function publishEdition(editionUID:string, editionMetadata: CustomizeIntf.EditionMetadata, editionQuestions:CustomizeIntf.EditionQuestions, callback?:Function) {
  return function(dispatch) {
    dispatch(setIncompleteQuestions([]))
    editionMetadata.last_published_at = firebase.database.ServerValue.TIMESTAMP
    editionMetadataRef.child(editionUID).set(editionMetadata)
    editionQuestionsRef.child(editionUID).set(editionQuestions)
    sendPublishEditionEventToLMS()
    if (callback) {
      callback()
    }

  }
}

function filterEditionsByUserIds(userIds:Array<Number|string>, editions:CustomizeIntf.EditionsMetadata) {
  return function (dispatch, getState) {
    if (editions && Object.keys(editions).length > 0) {
      const allowedIds = userIds.concat('quill-staff')
      const userEditions = {}
      const editionIds = Object.keys(editions)
      editionIds.forEach(id => {
        const edition = editions[id]
        if (allowedIds.indexOf(edition.user_id) !== -1 && (!edition.flags || Array.isArray(edition.flags) && edition.flags.indexOf('archived') === -1 && edition.flags.indexOf('alpha') === -1)) {
          userEditions[id] = edition
        }
      })
      if (Object.keys(userEditions).length > 0) {
        dispatch(setEditionMetadata(userEditions))
      }
    }
  }
}

function setUserId(id:Number) {
  return { type: C.SET_USER_ID, id };
}

function setCoteachers(coteachers:Array<any>) {
  return { type: C.SET_COTEACHERS, coteachers };
}

function setEditionMetadata(editionMetadata:CustomizeIntf.EditionsMetadata) {
  return { type: C.SET_EDITION_METADATA, editionMetadata };
}

function setEditionQuestions(editionQuestions:CustomizeIntf.EditionQuestions|{}) {
  return { type: C.SET_EDITION_QUESTIONS, editionQuestions };
}

function sendPublishEditionEventToLMS() {
  fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/published_edition`, {
    method: "POST",
    mode: "cors",
    credentials: 'include',
  })
}
