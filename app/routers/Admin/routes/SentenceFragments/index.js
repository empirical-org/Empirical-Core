import SentenceFragments from 'components/sentenceFragments/sentenceFragments.jsx';

export default {
  path: 'sentence-fragments',
  indexRoute: {
    component: SentenceFragments,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./newSentenceFragment.js'),
      System.import('./sentenceFragment.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
