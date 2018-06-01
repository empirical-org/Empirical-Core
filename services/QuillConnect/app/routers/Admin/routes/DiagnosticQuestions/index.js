import DiagnosticQuestions from 'components/diagnosticQuestions/diagnosticQuestions.jsx';

export default {
  path: 'diagnostic-questions',
  indexRoute: {
    component: DiagnosticQuestions,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./newDiagnosticQuestion.js'),
      System.import('./diagnosticQuestion.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
