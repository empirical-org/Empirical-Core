declare function require(name:string);
import rootRef, { firebase } from '../libs/firebase';
import C from '../constants';
import * as CustomizeIntf from '../interfaces/customize'
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates'
import _ from 'lodash'

import uuid from 'uuid/v4';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

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

export function getEditionMetadataForUserIds(userIds:Array<Number>, lessonID:string) {
  return function (dispatch, getState) {
    socket.on(`editionMetadataForLesson:${lessonID}`, (editions) => {
      dispatch(filterEditionsByUserIds(userIds, editions))
    })
    socket.emit('getAllEditionMetadataForLesson', lessonID)
  };
}

export function startListeningToEditionMetadata() {
  return function (dispatch, getState) {
    socket.on(`editionMetadata`, (editions) => {
      if (!_.isEqual(editions, getState().customize.editions)) {
        dispatch(setEditionMetadata(editions))
      }
    })
    socket.emit('getAllEditionMetadata')
  };
}

export function getEditionQuestions(editionID:string) {
  return function (dispatch, getState) {
    socket.on(`editionQuestionsForEdition:${editionID}`, (questions) => {
      if (!_.isEqual(getState().customize.editionQuestions, questions)) {
        dispatch(setEditionQuestions(questions))
      }
    })
    socket.emit('getEditionQuestions', editionID)
  };
}

export function clearEditionQuestions() {
  return function(dispatch, getState) {
    dispatch(setEditionQuestions({}))
  }
}

export function createNewEdition(editionUID:string|null, lessonUID:string, user_id:Number|string, classroomActivityId?:string, callback?:any) {
  let newEditionData, newEdition;
  const newEditionKey = uuid();
  if (editionUID) {
    newEditionData = {lesson_id: lessonUID, edition_id: editionUID, user_id: user_id, id: newEditionKey}
  } else {
    newEditionData = {lesson_id: lessonUID, user_id: user_id, id: newEditionKey}
  }
  socket.emit('createNewEdition', newEditionData)
  socket.on(`editionCreated:${newEditionKey}`, () => {
    socket.removeAllListeners(`editionCreated:${newEditionKey}`)
    if (callback) {
      callback(lessonUID, newEditionKey, classroomActivityId)
    }
  })
  return newEditionKey
}

export function createNewAdminEdition(editionUID:string|null, lessonUID:string, user_id:Number|string, callback?:any, name?:string) {
  let newEditionData, newEdition, questions;
  const newEditionKey = uuid();
  if (editionUID) {
    newEditionData = {id: newEditionKey, lesson_id: lessonUID, edition_id: editionUID, user_id: user_id, name: name, flags: ['alpha']}
  } else {
    newEditionData = {id: newEditionKey, lesson_id: lessonUID, user_id: user_id, name: name, flags: ['alpha']}
    questions = [lessonSlideBoilerplates['CL-LB'], lessonSlideBoilerplates['CL-EX']]
  }
  socket.emit('createNewEdition', newEditionData, questions)
  socket.on(`editionCreated:${newEditionKey}`, () => {
    socket.removeAllListeners(`editionCreated:${newEditionKey}`)
    if (callback) {
      callback(lessonUID, newEditionKey)
    } else {
      return newEditionKey
    }
  })
}

export function saveEditionName(editionUID:string, name:string) {
  const edition = {id: editionUID, name}
  socket.emit('updateEditionMetadata', edition)
}

export function archiveEdition(editionUID:string) {
  socket.emit('archiveEdition', editionUID)
}

export function deleteEdition(editionUID:string) {
  socket.emit('deleteEdition', editionUID)
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
    editionMetadata.id = editionUID
    editionQuestions.id = editionUID
    socket.emit('publishEdition', editionMetadata, editionQuestions)
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
        if (allowedIds.indexOf(edition.user_id) !== -1 && (!edition.flags || edition.flags.indexOf('archived') === -1 && edition.flags.indexOf('alpha') === -1)) {
          userEditions[id] = edition
        }
      })
      if (Object.keys(userEditions).length > 0 && !_.isEqual(userEditions, getState().customize.editions)) {
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
