export default {
  path: 'customize/',
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import(/* webpackChunkName: "customize-lesson" */ './routes/ClassroomLessons/index.js'),
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    // to do, use Sentry to capture error
    // .catch(err => console.error('Dynamic page loading failed', err))
  },
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('../../components/customize/customize').default);
    }, 'customize-root');
  },
};
