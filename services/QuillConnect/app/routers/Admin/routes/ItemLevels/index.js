import ItemLevels from 'components/itemLevels/itemLevels.jsx';

export default {
  path: 'item-levels',
  indexRoute: {
    component: ItemLevels,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import('./newItemLevel.js'),
      import('./itemLevel.js'),
      import('./editItemLevel.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },
};