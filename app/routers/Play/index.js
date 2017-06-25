export default {
  path: 'play/',
  getChildRoutes: (partialNextState, cb) => {
    System.import('./routes/Lessons/index.js')
    .then((component) => {
      cb(null, component.default);
    });
    // require.ensure([], (require) => {
    //   cb(null, [
    //     require('./routes/Lessons/index.js').default
    //     // require('./routes/Diagnostics/index.js')
    //   ], 'lessons-routes');
    // });
  },
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('../../components/studentRoot.js').default);
    });
  },
};
