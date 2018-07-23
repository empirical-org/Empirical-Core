import TitleCards from 'components/titleCards/titleCards.tsx';

export default {
  path: 'title-cards',
  indexRoute: {
    component: TitleCards,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import('./newTitleCard.js'),
      import('./showTitleCard.js'),
      import('./editTitleCard.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
