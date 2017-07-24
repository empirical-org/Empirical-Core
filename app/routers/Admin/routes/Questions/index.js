import Questions from 'components/questions/questions.jsx';

export default {
  path: 'questions',
  indexRoute: {
    component: Questions,
  },
  getChildRoutes: (partialNextState, cb) => {
    System.import(/* webpackChunkName: "admin-question" */ './question.js')
    .then(module => cb(null, module.default))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
};
