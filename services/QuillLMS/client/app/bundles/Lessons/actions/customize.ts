declare function require(name:string);
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates';
import C from '../constants';
import * as CustomizeIntf from '../interfaces/customize';

import socket from '../utils/socketStore';

export function getCurrentUserAndCoteachersFromLMS() {
  return function(dispatch) {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/api/v1/users/current_user_and_coteachers`, {
      method: "GET",
      mode: "cors",
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        // to do - do something with this status text
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

export function getEditionMetadataForUserIds(
  userIds:Array<Number>,
  activityId:string
) {
  return function (dispatch) {
    socket.instance.on(`editionMetadataForLesson:${activityId}`, (editions) => {
      dispatch(selectQuillStaffAndUserEditions(userIds, editions))
    })
    socket.instance.emit('getAllEditionMetadataForLesson', { activityId });
  };
}

export function getEditionMetadata(activityId:string, editionId:string) {
  return function (dispatch) {
    socket.instance.on(`editionMetadataForLesson:${activityId}`, (editions) => {
      setEditionMetadata(editions)
    })
    socket.instance.emit('getEditionMetadataForLesson', { activityId, editionId });
  };
}

export function startListeningToEditionMetadata() {
  return function (dispatch, getState) {
    socket.instance.on(`editionMetadata`, (editions) => {
      if (!_.isEqual(editions, getState().customize.editions)) {
        dispatch(setEditionMetadata(editions))
      }
    })
    socket.instance.emit('getAllEditionMetadata')
  };
}

export function getEditionQuestions(editionId:string) {
  return function (dispatch, getState) {
    socket.instance.on(`editionQuestionsForEdition:${editionId}`, (questions) => {
      if (!_.isEqual(getState().customize.editionQuestions, questions)) {
        dispatch(setEditionQuestions(questions))
        dispatch(setOriginalEditionQuestions(questions))
      }
    })
    socket.instance.emit('getEditionQuestions', { editionId });
  };
}

export function clearEditionQuestions() {
  return function(dispatch, getState) {
    dispatch(setEditionQuestions({}))
  }
}

export function createNewEdition(
  editionId:string|null,
  activityId:string,
  userId:Number|string,
  classroomUnitId?:string,
  callback?:any
) {
  let newEditionData, newEdition;
  const newEditionKey = uuid();
  if (editionId) {
    newEditionData = {lesson_id: activityId, edition_id: editionId, user_id: userId, id: newEditionKey}
  } else {
    newEditionData = {lesson_id: activityId, user_id: userId, id: newEditionKey}
  }
  socket.instance.emit('createNewEdition', { editionData: newEditionData });
  socket.instance.on(`editionCreated:${newEditionKey}`, () => {

    socket.instance.removeAllListeners(`editionCreated:${newEditionKey}`)
    if (callback) {
      callback(activityId, newEditionKey, classroomUnitId)
    }
  })
  return newEditionKey
}

export function createNewAdminEdition(
  editionId:string|null,
  activityId:string,
  userId:Number|string,
  callback?:any,
  name?:string
) {
  let newEditionData, newEdition, questions;
  const newEditionKey = uuid();
  if (editionId) {
    newEditionData = {id: newEditionKey, lesson_id: activityId, edition_id: editionId, user_id: userId, name: name, flags: ['alpha']}
  } else {
    newEditionData = {id: newEditionKey, lesson_id: activityId, user_id: userId, name: name, flags: ['alpha']}
    questions = [lessonSlideBoilerplates['CL-LB'], lessonSlideBoilerplates['CL-EX']]
  }
  socket.instance.emit('createNewEdition', {
    editionData: newEditionData,
    questions,
  });
  socket.instance.on(`editionCreated:${newEditionKey}`, () => {
    socket.instance.removeAllListeners(`editionCreated:${newEditionKey}`)
    if (callback) {
      callback(activityId, newEditionKey)
    } else {
      return newEditionKey
    }
  })
}

export function saveEditionName(editionId:string, name:string) {
  const editionMetadata = { id: editionId, name }
  socket.instance.emit('updateEditionMetadata', { editionMetadata });
}

export function archiveEdition(editionId:string) {
  socket.instance.emit('archiveEdition', { editionId });
}

export function deleteEdition(editionId:string) {
  socket.instance.emit('deleteEdition', { editionId });
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

export function publishEdition(editionId:string, editionMetadata: CustomizeIntf.EditionMetadata, editionQuestions:CustomizeIntf.EditionQuestions, callback?:Function) {
  return function(dispatch) {
    dispatch(setIncompleteQuestions([]))
    editionMetadata.id = editionId
    editionQuestions.id = editionId
    socket.instance.emit('publishEdition', {
      editionMetadata,
      editionQuestions
    });
    sendPublishEditionEventToLMS()
    if (callback) {
      callback()
    }
  }
}

function selectQuillStaffAndUserEditions(
  userIds:Array<Number|string>,
  editions:CustomizeIntf.EditionsMetadata
) {
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

export function setEditionMetadata(editionMetadata:CustomizeIntf.EditionsMetadata) {
  return { type: C.SET_EDITION_METADATA, editionMetadata };
}

export function setEditionQuestions(editionQuestions:CustomizeIntf.EditionQuestions|{}) {
  return { type: C.SET_EDITION_QUESTIONS, editionQuestions };
}

export function setOriginalEditionQuestions(originalEditionQuestions:CustomizeIntf.EditionQuestions|{}) {
  return { type: C.SET_ORIGINAL_EDITION_QUESTIONS, originalEditionQuestions };
}

function sendPublishEditionEventToLMS() {
  fetch(`${import.meta.env.VITE_DEFAULT_URL}/api/v1/published_edition`, {
    method: "POST",
    mode: "cors",
    credentials: 'include',
  })
}
