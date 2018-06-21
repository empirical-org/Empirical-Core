export default {
  path: 'admin',
  indexRoute: { onEnter: (nextState, replace) => replace('/admin/question-health'), },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import(/* webpackChunkName: "admin-concept_feedback" */ './routes/ConceptFeedback/index.js'),
      System.import(/* webpackChunkName: "admin-concepts" */ './routes/Concepts/index.js'),
      System.import(/* webpackChunkName: "admin-dashboard" */ './routes/DataDash/index.js'),
      System.import(/* webpackChunkName: "admin-question-health" */ './routes/QuestionHealth/index.js'),
      System.import(/* webpackChunkName: "admin-title-cards" */ './routes/TitleCards/index.js'),
      System.import(/* webpackChunkName: "admin-lessons" */ './routes/Lessons/index.js'),
      System.import(/* webpackChunkName: "admin-questions" */ './routes/Questions/index.js'),
      System.import(/* webpackChunkName: "admin-fill-in-the-blanks" */ './routes/FillInTheBlanks/index.js'),
      System.import(/* webpackChunkName: "admin-sentence-fragments" */ './routes/SentenceFragments/index.js'),
      System.import(/* webpackChunkName: "admin-item-levels" */ './routes/ItemLevels/index.js')
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
