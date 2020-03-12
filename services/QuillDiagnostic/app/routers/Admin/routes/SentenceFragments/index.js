import SentenceFragments from 'components/sentenceFragments/sentenceFragments.jsx';

export default {
  path: 'sentence-fragments',
  indexRoute: {
    component: SentenceFragments,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import('./newSentenceFragment.js'),
      import('./sentenceFragment.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    // to do, use Sentry to capture error
    // .catch(err => console.error('Dynamic page loading failed', err));
  },

};
