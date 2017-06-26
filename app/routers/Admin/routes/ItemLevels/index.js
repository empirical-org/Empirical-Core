import ItemLevels from 'components/itemLevels/itemLevels.jsx';

export default {
  path: 'item-levels',
  indexRoute: {
    component: ItemLevels,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      System.import('./newItemLevel.js'),
      System.import('./itemLevel.js'),
      System.import('./editItemLevel.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
};