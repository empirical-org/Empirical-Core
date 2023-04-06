declare function require(name:string);
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import * as IntF from '../components/classroomLessons/interfaces';
import lessonBoilerplate from '../components/classroomLessons/shared/classroomLessonBoilerplate';
import lessonSlideBoilerplates from '../components/classroomLessons/shared/lessonSlideBoilerplates';
import scriptItemBoilerplates from '../components/classroomLessons/shared/scriptItemBoilerplates';
import C from '../constants';
import * as CustomizeIntF from '../interfaces/customize';
import socket from '../utils/socketStore';
import { setEditionMetadata } from './customize';

export function getClassLesson(classroomLessonUid: string) {
  return function (dispatch, getState) {
    socket.instance.on(`classroomLesson:${classroomLessonUid}`, (lesson) => {
      if (lesson) {
        if (!_.isEqual(getState().classroomLesson.data, lesson)) {
          dispatch(updateClassroomLesson(lesson));
        }
        if (getState().classroomLesson.data.id !== classroomLessonUid) {
          dispatch(setLessonId(classroomLessonUid))
        }
      } else {
        dispatch({type: C.NO_LESSON_ID, data: classroomLessonUid})
      }
    });
    socket.instance.emit('subscribeToClassroomLesson', { classroomLessonUid });
  };
}

export function updateClassroomLesson(data) {
  return {
    type: C.RECEIVE_CLASSROOM_LESSON_DATA,
    data,
  }
}

export function setLessonId(id:string) {
  return {
    type: C.SET_LESSON_ID,
    id
  }
}

export function listenForClassroomLessons() {
  return function (dispatch) {
    socket.instance.on('classroomLessons', (classroomLessons) => {
      if (classroomLessons) {
        dispatch(updateClassroomLessons(classroomLessons))
      } else {
        dispatch({type: C.NO_LESSONS})
      }
    });
    socket.instance.emit('getAllClassroomLessons');
  };
}

export function listenForClassroomLessonReviews() {
  return function (dispatch) {
    socket.instance.on('classroomLessonReviews', (reviews) => {
      if (reviews) {
        dispatch(updateClassroomLessonsReviews(reviews))
      }
    });
    socket.instance.emit('getAllClassroomLessonReviews');
  };
}

export function updateClassroomLessons(data) {
  return ({type: C.RECEIVE_CLASSROOM_LESSONS_DATA, data: data})
}

export function updateClassroomLessonsReviews(data) {
  const reviewsGroupedByClassroomLessonId = {}
  const classroomUnitIds = Object.keys(data)
  classroomUnitIds.forEach((classroomUnitId) => {
    const review = data[classroomUnitId]
    const lessonId = review.activity_id
    if (reviewsGroupedByClassroomLessonId[lessonId]) {
      reviewsGroupedByClassroomLessonId[lessonId][classroomUnitId] = review
    } else {
      reviewsGroupedByClassroomLessonId[lessonId] = { [classroomUnitId]: review }
    }
  })
  return ({type: C.RECEIVE_CLASSROOM_LESSONS_REVIEW_DATA, data: reviewsGroupedByClassroomLessonId})
}

export function addSlide(editionId: string, editionQuestions: CustomizeIntF.EditionQuestions, slideType: string, callback:Function|undefined) {
  const newEdition: CustomizeIntF.EditionQuestions = _.merge({}, editionQuestions)
  const newSlide: IntF.Question = lessonSlideBoilerplates[slideType]
  newEdition.questions.splice(-1, 0, newSlide)

  socket.instance.on(`slideAdded:${editionId}`, () => {
    socket.instance.removeAllListeners(`slideAdded:${editionId}`)
    if (callback) {
      callback(Number(newEdition.questions.length) - 2)
    }
  })
  socket.instance.emit('addSlide', { editionId, newEdition })
}

export function deleteEditionSlide(editionId, slideId, slides) {
  const newSlides = _.compact(Object.keys(slides).map(slideKey => {
    if (slideKey != slideId ) {
      return slides[slideKey]
    }
  }))
  socket.instance.emit('deleteEditionSlide', { editionId, slides: newSlides })
}

export function addScriptItem(editionId: string, slideId: string, slide: IntF.Question, scriptItemType: string, callback: Function|undefined) {
  const newSlide = _.merge({}, slide)
  newSlide.data.teach.script.push(scriptItemBoilerplates[scriptItemType])

  socket.instance.on(`scriptItemAdded:${editionId}`, () => {
    socket.instance.removeAllListeners(`scriptItemAdded:${editionId}`)
    if (callback) {
      callback(newSlide.data.teach.script.length - 1)
    }
  })
  socket.instance.emit('addScriptItem', { editionId, slideId, slide: newSlide })
}

export function deleteScriptItem(editionId, slideId, scriptItemId, script) {
  const newScript = _.compact(Object.keys(script).map(scriptKey => {
    if (scriptKey != scriptItemId ) {
      return script[scriptKey]
    }
  }))
  socket.instance.emit('deleteScriptItem', { editionId, slideId, script: newScript })
}

export function addLesson(lessonName, cb) {
  const newLesson:IntF.ClassroomLesson = lessonBoilerplate(lessonName)
  const newLessonKey = uuid();
  newLesson.id = newLessonKey
  if (newLessonKey) {
    socket.instance.emit('createOrUpdateClassroomLesson', { classroomLesson: newLesson })
  }

  socket.instance.on(`createdOrUpdatedClassroomLesson:${newLessonKey}`, (lessonUpdated) => {
    socket.instance.removeAllListeners(`createdOrUpdatedClassroomLesson:${newLessonKey}`)
    if (lessonUpdated) {
      if (cb) {
        cb(newLessonKey)
      }
    }
  })
}

export function saveEditionSlide(editionId, slideId, slideData, callback) {
  socket.instance.on(`editionSlideSaved:${editionId}`, () => {
    socket.instance.removeAllListeners(`editionSlideSaved:${editionId}`)
    if (callback) {
      callback()
    }
  })
  socket.instance.emit('saveEditionSlide', { editionId, slideId, slideData })
}

export function saveEditionScriptItem(editionId, slideId, scriptItemId, scriptItem, callback) {
  socket.instance.on(`editionScriptItemSaved:${editionId}`, () => {
    socket.instance.removeAllListeners(`editionScriptItemSaved:${editionId}`)
    if (callback) {
      callback();
    }
  })

  socket.instance.emit('saveEditionScriptItem', {
    editionId,
    slideId,
    scriptItemId,
    scriptItem,
  })
}

export function deleteLesson(classroomLessonId) {
  socket.instance.emit('deleteClassroomLesson', { classroomLessonId })
}

export function deleteEdition(editionId, callback) {
  return (dispatch) => {
    socket.instance.emit('deleteEdition', { editionId })
    socket.instance.on('editionMetadata', editions => {
      if (callback) {
        callback()
      }
      dispatch(setEditionMetadata(editions))
    })
  }
}

export function updateSlideScriptItems(editionId, slideId, scriptItems) {
  socket.instance.emit('updateSlideScriptItems', { editionId, slideId, scriptItems })
}

export function updateEditionSlides(editionId, slides) {
  socket.instance.emit('updateEditionSlides', { editionId, slides })
}

export function updateClassroomLessonDetails(classroomLessonId, classroomLesson) {
  return (dispatch) => {
    classroomLesson.id = classroomLessonId
    socket.instance.emit('createOrUpdateClassroomLesson', { classroomLesson })
    socket.instance.on('classroomLessons', (classroomLessons) => {
      if (classroomLessons) {
        dispatch(updateClassroomLessons(classroomLessons))
      } else {
        dispatch({type: C.NO_LESSONS})
      }
    })
  }
}

export function updateEditionDetails(editionId, editionMetadata) {
  return (dispatch) => {
    editionMetadata.id = editionId
    socket.instance.emit('updateEditionMetadata', { editionMetadata })
    socket.instance.on('editionMetadata', editions => {
      dispatch(setEditionMetadata(editions))
    })
  }
}

export function clearClassroomLessonFromStore() {
  return ({type: C.CLEAR_CLASSROOM_LESSON_DATA})
}
