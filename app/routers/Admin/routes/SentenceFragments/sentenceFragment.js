import SentenceFragment from 'components/sentenceFragments/sentenceFragment.jsx';
import ResponsesRoute from 'routers/Admin/routes/Shared/responses';
import MassEditRoute from 'routers/Admin/routes/Shared/massEdit';

export default {
  path: ':questionID',
  component: SentenceFragment,
  indexRoute: {
    onEnter: ({ params, }, replace) => replace(`admin/sentence-fragments/${params.questionID}/responses`),
  },
  childRoutes: [
    ResponsesRoute,
    MassEditRoute
  ],
};