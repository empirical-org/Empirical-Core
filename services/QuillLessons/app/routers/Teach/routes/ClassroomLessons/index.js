import { Passthrough } from 'quill-component-library/dist/componentLibrary';

import { getParameterByName } from 'libs/getParameterByName';
import { createPreviewSession } from '../../../../actions/classroomSessions'

const previewEditionRoute = {
  path: ':lessonID/preview/:editionID',
  onEnter: (nextState, replaceWith) => {
    const classroomActivityId = createPreviewSession(nextState.params.editionID)
    const modalQSValue = getParameterByName('modal')
    const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
    if (classroomActivityId) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${nextState.params.lessonID}?&classroom_activity_id=${classroomActivityId}${modalQS}`;
    }
  }
};

const previewRoute = {
  path: ':lessonID/preview',
  onEnter: (nextState, replaceWith) => {
    const classroomActivityId = createPreviewSession()
    const modalQSValue = getParameterByName('modal')
    const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
    if (classroomActivityId) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${nextState.params.lessonID}?&classroom_activity_id=${classroomActivityId}${modalQS}`;
    }
  }
};

const markingLessonAsCompletedRoute = {
  path: ':lessonID/mark_lesson_as_completed',
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "teach-classroom-lesson" */'components/classroomLessons/teach/markingLessonAsCompleted.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const teachRoute = {
  path: ':lessonID',
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "teach-classroom-lesson" */'components/classroomLessons/teach/container.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const indexRoute = {
  component: Passthrough,
  onEnter: (nextState, replaceWith) => {
    const classroom_activity_id = getParameterByName('classroom_activity_id');
    const lessonID = getParameterByName('uid');
    if (lessonID) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${lessonID}?&classroom_activity_id=${classroom_activity_id}`;
    }
  },
};

const route = {
  path: 'class-lessons',
  indexRoute,
  childRoutes: [
    previewEditionRoute,
    markingLessonAsCompletedRoute,
    previewRoute,
    teachRoute
  ],
  component: Passthrough,
};

export default route;
