import { Passthrough } from 'quill-component-library/dist/componentLibrary';

import { getParameterByName } from 'libs/getParameterByName';

const playRoute = {
  path: ':lessonID',
  onEnter: (nextState, replaceWith) => {
    document.title = 'Quill Lessons';
  },
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "teach-classroom-lesson" */'components/classroomLessons/play/container.tsx')
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
    document.title = 'Quill Lessons';
    const student = getParameterByName('student');
    if (lessonID) {
      document.location.href = `${document.location.origin + document.location.pathname}#/play/class-lessons/${lessonID}?student=${student}&classroom_activity_id=${classroom_activity_id}`;
    }
  },
};

const route = {
  path: 'class-lessons',
  indexRoute,
  childRoutes: [
    playRoute
  ],
  component: Passthrough,
};

export default route;
