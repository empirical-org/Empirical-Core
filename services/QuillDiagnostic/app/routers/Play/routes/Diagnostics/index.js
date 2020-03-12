import { Passthrough } from 'quill-component-library/dist/componentLibrary';

const diagnosticRoute = {
  path: ':diagnosticID',
  getComponent: (nextState, cb) => {
    import(/* webpackChunkName: "student-diagnostic" */ 'components/shared/diagnosticRouter.tsx')
    .then((component) => {
      cb(null, component.default);
    });
  },
};

const route = {
  path: 'diagnostic',
  childRoutes: [
    diagnosticRoute
  ],
  component: Passthrough,
};

export default route;
