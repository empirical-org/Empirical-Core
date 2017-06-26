export default {
  path: 'admin',
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./routes/ConceptFeedback/index.js'),
      System.import('./routes/Concepts/index.js'),
      System.import('./routes/DataDash/index.js'),
      System.import('./routes/Lessons/index.js'),
      System.import('./routes/DiagnosticQuestions/index.js'),
      System.import('./routes/Questions/index.js'),
      System.import('./routes/FillInTheBlanks/index.js'),
      System.import('./routes/SentenceFragments/index.js'),
      System.import('./routes/Diagnostics/index.js'),
      System.import('./routes/ItemLevels/index.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/admin/admin.jsx').default);
    });
  },
};
