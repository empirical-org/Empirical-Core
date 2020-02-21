import { Passthrough } from 'quill-component-library/dist/componentLibrary';

const playRoute = {
  path: ':lessonID',
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "student-lesson" */'components/studentLessons/lesson.jsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const route = {
  path: 'lesson',
  childRoutes: [
    playRoute
  ],
  component: Passthrough,
};

export default route;
