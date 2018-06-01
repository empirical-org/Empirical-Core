import Passthrough from 'components/shared/passthrough.jsx';

const successRoute = {
  path: ':lessonID/:editionID/success',
  onEnter: (nextState, replaceWith) => {
    document.title = 'Quill Lessons';
  },
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "customize-classroom-lesson-edition" */'components/customize/edition.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const editionRoute = {
  path: ':lessonID/:editionID',
  onEnter: () => {
    document.title = 'Quill Lessons';
  },
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "customize-classroom-lesson-edition" */'components/customize/edition.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const chooseEditionRoute = {
  path: ':lessonID',
  onEnter: () => {
    document.title = 'Quill Lessons';
  },
  getComponent: (nextState, cb) => {
    System.import(/* webpackChunkName: "customize-choose-edition" */'components/customize/chooseEdition.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const indexRoute = {
  component: Passthrough,
  onEnter: (nextState, replaceWith) => {
    document.title = 'Quill Lessons';
  },
};

const route = {
  indexRoute,
  childRoutes: [
    successRoute,
    editionRoute,
    chooseEditionRoute
  ],
  component: Passthrough,
};

export default route;
