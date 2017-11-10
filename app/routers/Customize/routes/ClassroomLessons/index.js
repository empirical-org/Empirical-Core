import Passthrough from 'components/shared/passthrough.jsx';
import { createNewEdition} from '../../../../actions/customize'
import { getParameterByName } from 'libs/getParameterByName';

const createNewEditionRoute = {
  path: ':lessonID/create_new_edition/:editionID/:userID',
  onEnter: (nextState, replaceWith) => {
    const editionID = createNewEdition(nextState.params.editionID, nextState.params.lessonID, nextState.params.userID)
    const classroomActivityIdQSVal = getParameterByName('classroom_activity_id')
    const classroomActivityIdQS = classroomActivityIdQSVal ? `?&classroom_activity_id=${classroomActivityIdQSVal}` : ''
    if (editionID) {
      document.location.href = `${document.location.origin + document.location.pathname}#/customize/${nextState.params.lessonID}/${editionID}${classroomActivityIdQS}`
    }
  },
};

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
    createNewEditionRoute,
    successRoute,
    editionRoute,
    chooseEditionRoute
  ],
  component: Passthrough,
};

export default route;
