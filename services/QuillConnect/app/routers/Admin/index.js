import request from 'request';

const usersEndpoint = `${process.env.EMPIRICAL_BASE_URL}/api/v1/users.json`;
const newSessionEndpoint = `${process.env.EMPIRICAL_BASE_URL}/session/new`;

export default {
  path: 'admin',
  indexRoute: { onEnter: (nextState, replace) => replace('/admin/question-health'), },
  getChildRoutes: (partialNextState, cb) => {
    fetch(usersEndpoint, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      }).then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }).then((response) => {
          if (response.user === null || (response.user.hasOwnProperty('role') && response.user.role !== 'staff')){
            window.location = newSessionEndpoint;
          }
          else {
            Promise.all([
              import(/* webpackChunkName: "admin-concept-feedback" */ './routes/ConceptFeedback/index.js'),
              import(/* webpackChunkName: "admin-concepts" */ './routes/Concepts/index.js'),
              import(/* webpackChunkName: "admin-dashboard" */ './routes/DataDash/index.js'),
              import(/* webpackChunkName: "admin-question-health" */ './routes/QuestionHealth/index.js'),
              import(/* webpackChunkName: "admin-title-cards" */ './routes/TitleCards/index.js'),
              import(/* webpackChunkName: "admin-lessons" */ './routes/Lessons/index.js'),
              import(/* webpackChunkName: "admin-questions" */ './routes/Questions/index.js'),
              import(/* webpackChunkName: "admin-fill-in-the-blanks" */ './routes/FillInTheBlanks/index.js'),
              import(/* webpackChunkName: "admin-sentence-fragments" */ './routes/SentenceFragments/index.js'),
              import(/* webpackChunkName: "admin-item-levels" */ './routes/ItemLevels/index.js')
            ])
            .then(modules => cb(null, modules.map(module => module.default)))
            // to do, use Sentry to capture error
            // .catch(err => console.error('Dynamic page loading failed', err));
          }
      }).catch((error) => {
        // to do, use Sentry to capture error
      })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/admin/admin').default);
    }, 'admin-root');
  },
};
