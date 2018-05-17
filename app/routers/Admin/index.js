import socket from '../../utils/socketStore'

export default {
  path: 'admin',
  getChildRoutes: (partialNextState, cb) => {
    socket.connect(null,
      Promise.all([
        System.import(/* webpackChunkName: "admin-concept-feedback" */ './routes/ConceptFeedback/index.js'),
        System.import(/* webpackChunkName: "admin-concepts" */ './routes/Concepts/index.js'),
        System.import(/* webpackChunkName: "admin-dashboard" */ './routes/DataDash/index.js'),
        System.import(/* webpackChunkName: "admin-question-health" */ './routes/QuestionHealth/index.js'),
        System.import(/* webpackChunkName: "admin-lessons" */ './routes/Lessons/index.js'),
        System.import(/* webpackChunkName: "admin-diagsnostic-questions" */ './routes/DiagnosticQuestions/index.js'),
        System.import(/* webpackChunkName: "admin-questions" */ './routes/Questions/index.js'),
        System.import(/* webpackChunkName: "admin-fill-in-the-blanks" */ './routes/FillInTheBlanks/index.js'),
        System.import(/* webpackChunkName: "admin-sentence-fragments" */ './routes/SentenceFragments/index.js'),
        System.import(/* webpackChunkName: "admin-item-levels" */ './routes/ItemLevels/index.js'),
        System.import(/* webpackChunkName: "admin-class-lessons" */ './routes/ClassLessons/index.js')
      ])
      .then(modules => cb(null, modules.map(module => module.default)))
      .catch(err => console.error('Dynamic page loading failed', err))
    );
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/admin/admin.jsx').default);
    }, 'admin-root');
  },
};
