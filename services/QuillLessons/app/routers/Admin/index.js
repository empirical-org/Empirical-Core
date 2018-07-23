export default {
  path: 'admin',
  indexRoute: { onEnter: (nextState, replace) => replace('/admin/classroom-lessons'), },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import(/* webpackChunkName: "admin-class-lessons" */ './routes/ClassLessons/index.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/admin/admin').default);
    }, 'admin-root');
  },
};
