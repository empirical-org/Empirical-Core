import Questions from 'components/questions/questions.jsx';

export default {
  path: 'questions',
  indexRoute: {
    component: Questions,
  },
  getChildRoutes: (partialNextState, cb) => {
    import(/* webpackChunkName: "admin-question" */ './question.js')
    .then(module => cb(null, module.default))
    // to do, use Sentry to capture error
    // .catch(err => console.error('Dynamic page loading failed', err));
  },
};
