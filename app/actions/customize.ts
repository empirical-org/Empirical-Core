declare function require(name:string);
import rootRef, { firebase } from '../libs/firebase';
const editionsRef = rootRef.child('lessons_editions');
const classroomLessonsRef = rootRef.child('classroom_lessons');
import  C from '../constants';

export function getCurrentUserFromLMS() {
  return function(dispatch) {
    fetch(`${process.env.EMPIRICAL_BASE_URL}/api/v1/users`, {
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
      }
    })
  }
}

export function getEditionsByUser(user_id) {
  return function (dispatch, getState) {
    editionsRef.on('value', (snapshot) => {
      dispatch(filterForUserEditions(user_id, snapshot.val()))
    });
  };
}

export function createNewEdition(editionUID, lessonUID, user_id) {
  let newEditionData
  const lessonData = []
  if (editionUID) {
    editionsRef.child(editionUID).once('value', (snapshot) => {
      lessonData.push(snapshot.val())
    })
    newEditionData = {...lessonData[0], lesson_id: lessonUID, edition_id: editionUID, user_id}
  } else {
    newEditionData = classroomLessonsRef.child(lessonUID).once('value', (snapshot) => {
      lessonData.push(snapshot.val())
    })
    newEditionData = {...lessonData[0], lesson_id: lessonUID, user_id}
  }
  const newEdition = editionsRef.push(newEditionData)
  return newEdition.key
}

export function saveEditionName(editionUID, name) {
  editionsRef.child(`${editionUID}/name`).set(name)
  // const startTimeRef = classroomSessionsRef.child(`${classroom_activity_id}/startTime`);
  // startTimeRef.once('value', (snapshot) => {
  //   const startTime = snapshot.val()
  //   if (!startTime) {
  //     startTimeRef.set(firebase.database.ServerValue.TIMESTAMP)
  //   }
  // })

}

function filterForUserEditions(userId, editions) {
  return function (dispatch, getState) {
    if (editions && Object.keys(editions).length > 0) {
      const userEditions = {}
      const editionIds = Object.keys(editions)
      editionIds.forEach(id => {
        if (editions[id].user_id === userId) {
          userEditions[id] = editions[id]
        }
      })
      if (Object.keys(userEditions).length > 0) {
        dispatch(setEditions(userEditions))
      }
    }
  }
}

function setUserId(id) {
  return { type: C.SET_USER_ID, id };
}

function setEditions(editions) {
  return { type: C.SET_EDITIONS, editions };
}
