import TitleCards from 'components/titleCards/titleCards.tsx';

export default {
  path: 'title-cards',
  component: TitleCards,
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import(/* webpackChunkName: "new-title-card" */ './newTitleCard.js'),
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
