import TitleCards from 'components/titleCards/titleCards.tsx';

export default {
  path: 'title-cards',
  indexRoute: {
    component: TitleCards,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./newTitleCard.js'),
      System.import('./showTitleCard.js'),
      System.import('./editTitleCard.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
