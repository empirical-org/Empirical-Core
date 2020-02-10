import request from 'request';

const usersEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/users.json`;
const newSessionEndpoint = `${process.env.EMPIRICAL_BASE_URL}/session/new`;

export default {
  path: 'admin',
  /*indexRoute: { onEnter: (nextState, replace) => replace('/admin/question-health'), },*/
  indexRoute: { onEnter: (nextState, replace) => (request(usersEndpoint, (error, response, body) => { if (!error && response.statusCode === 200) { const json_body = JSON.parse(body);if (json_body.user === null || (json_body.user.hasOwnProperty('role') && json_body.user.role !== 'staff')){ window.location = newSessionEndpoint } else { replace('/admin/question-health') }}}}),
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import(/* webpackChunkName: "admin-concept_feedback" */ './routes/ConceptFeedback/index.js'),
      import(/* webpackChunkName: "admin-concepts" */ './routes/Concepts/index.js'),
      import(/* webpackChunkName: "admin-dashboard" */ './routes/DataDash/index.js'),
      import(/* webpackChunkName: "admin-question-health" */ './routes/QuestionHealth/index.js'),
      import(/* webpackChunkName: "admin-title-cards" */ './routes/TitleCards/index.js'),
      import(/* webpackChunkName: "admin-lessons" */ './routes/Lessons/index.js'),
      import(/* webpackChunkName: "admin-questions" */ './routes/Questions/index.js'),
      import(/* webpackChunkName: "admin-fill-in-the-blanks" */ './routes/FillInTheBlanks/index.js'),
      import(/* webpackChunkName: "admin-sentence-fragments" */ './routes/SentenceFragments/index.js'),
      import(/* webpackChunkName: "admin-item-levels" */ './routes/ItemLevels/index.js'),
      import(/* webpackChunkName: "admin-item-levels" */ './routes/CloneConnectQuestions/index.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    // to do, use Sentry to capture error
    // .catch(err => console.error('Dynamic page loading failed', err));
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/admin/admin').default);
    }, 'admin-root');
  },
};
