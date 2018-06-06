import SentenceFragment from 'components/sentenceFragments/sentenceFragment.jsx';
import ResponsesRoute from 'routers/Admin/routes/Shared/responses';
import MassEditRoute from 'routers/Admin/routes/Shared/massEdit';
import TestSentenceFragmentContainer from 'components/sentenceFragments/testSentenceFragmentContainer.jsx';
import ChooseModelContainer from 'components/sentenceFragments/chooseModelContainer.jsx';
import SentenceFragmentIncorrectSequenceRoute from 'routers/Admin/routes/Shared/sentenceFragmentIncorrectSequences';
import FocusPointsRoute from 'routers/Admin/routes/Shared/focusPoints.js';

const testSentenceFragment = {
  path: 'test',
  component: TestSentenceFragmentContainer,
};

const chooseModel = {
  path: 'choose-model',
  component: ChooseModelContainer,
};

export default {
  path: ':questionID',
  component: SentenceFragment,
  indexRoute: {
    onEnter: ({ params, }, replace) => replace(`admin/sentence-fragments/${params.questionID}/responses`),
  },
  childRoutes: [
    ResponsesRoute,
    MassEditRoute,
    testSentenceFragment,
    chooseModel,
    SentenceFragmentIncorrectSequenceRoute,
    FocusPointsRoute
  ],
};
