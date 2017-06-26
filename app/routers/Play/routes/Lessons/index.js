import Passthrough from 'components/shared/passthrough.jsx';
import { getParameterByName } from 'libs/getParameterByName';

const playRoute = {
  path: ':lessonID',
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "student-lesson" */'components/studentLessons/lesson.jsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const indexRoute = {
  component: Passthrough,
  onEnter: (nextState, replaceWith) => {
    const lessonID = getParameterByName('uid');
    const studentID = getParameterByName('student');
    if (lessonID) {
      document.location.href = `${document.location.origin + document.location.pathname}#/play/lesson/${lessonID}?student=${studentID}`;
    }
  },
};

const route = {
  path: 'lesson',
  indexRoute,
  childRoutes: [
    playRoute
  ],
  component: Passthrough,
};

export default route;
