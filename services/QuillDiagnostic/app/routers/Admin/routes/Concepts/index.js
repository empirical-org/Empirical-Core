import Concepts from 'components/concepts/concepts.jsx';
import Concept from 'components/concepts/concept.jsx';

export default {
  path: 'concepts',
  indexRoute: {
    component: Concepts,
  },
  childRoutes: [
    {
      path: ':conceptID',
      component: Concept,
    }
  ],
};
