import Passthrough from 'components/shared/passthrough.jsx';

const editionRoute = {
  path: ':lessonID/:editionID',
  onEnter: (nextState, replaceWith) => {
    document.title = 'Customize Edition';
  },
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "customize-classroom-lesson-edition" */'components/customize/edition.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const lessonRoute = {
  path: ':lessonID',
  onEnter: (nextState, replaceWith) => {
    document.title = 'Customize Quill Lesson';
  },
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "customize-classroom-lesson" */'components/customize/lesson.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const indexRoute = {
  component: Passthrough,
  onEnter: (nextState, replaceWith) => {
    document.title = 'Customize Quill Lessons';
  },
};

const route = {
  indexRoute,
  childRoutes: [
    editionRoute,
    lessonRoute
  ],
  component: Passthrough,
};

export default route;
