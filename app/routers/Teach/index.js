import socket from '../../utils/socketStore';

export default {
  path: 'teach/',
  getChildRoutes: (partialNextState, cb) => {
    socket.connect(null,
      Promise.all([
        System.import(/* webpackChunkName: "teach-classroom-lesson" */ './routes/ClassroomLessons/index.js')
      ])
      .then(modules => cb(null, modules.map(module => module.default)))
      .catch(err => console.error('Dynamic page loading failed', err))
    )
  },
  getComponent: (nextState, cb) => {
    require.ensure([], (require) => {
      cb(null, require('components/root.js').default);
    }, 'root');
  },
};
