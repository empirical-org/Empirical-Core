import { Passthrough } from 'quill-component-library/dist/componentLibrary';

import { getParameterByName } from 'libs/getParameterByName';
import { createPreviewSession } from '../../../../actions/classroomSessions'

const previewEditionRoute = {
  path: ':lessonID/preview/:editionID',
  onEnter: (nextState, replaceWith) => {
    const classroomUnitId = createPreviewSession(nextState.params.editionID)
    const modalQSValue = getParameterByName('modal')
    const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
    if (classroomUnitId) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${nextState.params.lessonID}?&classroom_unit_id=${classroomUnitId}${modalQS}`;
    }
  }
};

const previewRoute = {
  path: ':lessonID/preview',
  onEnter: (nextState, replaceWith) => {
    const classroomUnitId = createPreviewSession()
    const modalQSValue = getParameterByName('modal')
    const modalQS = modalQSValue ? `&modal=${modalQSValue}` : ''
    if (classroomUnitId) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${nextState.params.lessonID}?&classroom_unit_id=${classroomUnitId}${modalQS}`;
    }
  }
};

const markingLessonAsCompletedRoute = {
  path: ':lessonID/mark_lesson_as_completed',
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "teach-classroom-lesson" */'components/classroomLessons/teach/markingLessonAsCompleted.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const teachRoute = {
  path: ':lessonID',
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "teach-classroom-lesson" */'components/classroomLessons/teach/container.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const indexRoute = {
  component: Passthrough,
  onEnter: (nextState, replaceWith) => {
    const classroomUnitId = getParameterByName('classroom_unit_id');
    const lessonID = getParameterByName('uid');
    if (lessonID) {
      document.location.href = `${document.location.origin + document.location.pathname}#/teach/class-lessons/${lessonID}?&classroom_unit_id=${classroomUnitId}`;
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
