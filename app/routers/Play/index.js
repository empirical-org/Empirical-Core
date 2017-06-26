export default {
  path: 'play/',
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./routes/Lessons/index.js'),
      System.import('./routes/Diagnostics/index.js'),
      System.import('./routes/Turk/index.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('../../components/studentRoot.js').default);
    });
  },
};
