import Passthrough from 'components/shared/passthrough.jsx';
import { createNewEdition} from '../../../../actions/customize'
import { getParameterByName } from 'libs/getParameterByName';

const successRoute = {
  path: ':lessonID/:editionID/success',
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

const chooseEditionRoute = {
  path: ':lessonID',
  onEnter: (nextState, replaceWith) => {
    document.title = 'Choose Edition';
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
    document.title = 'Customize Quill Lessons';
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
