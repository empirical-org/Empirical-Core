import Passthrough from 'components/shared/passthrough.jsx';

import { getParameterByName } from 'libs/getParameterByName';

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
    teachRoute
  ],
  component: Passthrough,
};

export default route;
