import Question from 'components/questions/question';
import ResponsesRoute from 'routers/Admin/routes/Shared/responses';
import MassEditRoute from 'routers/Admin/routes/Shared/massEdit';
import FocusPointsRoute from 'routers/Admin/routes/Shared/focusPoints';
import IncorrectSequenceRoute from 'routers/Admin/routes/Shared/incorrectSequences';
import ChooseModelContainer from 'components/questions/chooseModelContainer.jsx';
import TestQuestionContainer from 'components/questions/testQuestion';
import AnswerVisualizer from 'components/misc/answerVisualizer.jsx';

const chooseModel = {
  path: 'choose-model',
  component: ChooseModelContainer,
};

const testQuestion = {
  path: 'test',
  component: TestQuestionContainer,
};

const visualizeRoute = {
  path: 'visualize',
  component: AnswerVisualizer,
};

export default {
  path: ':questionID',
  component: Question,
  indexRoute: {
    onEnter: ({ params, }, replace) => replace(`admin/questions/${params.questionID}/responses`),
  },
  childRoutes: [
    ResponsesRoute,
    MassEditRoute,
    FocusPointsRoute,
    IncorrectSequenceRoute,
    chooseModel,
    testQuestion,
    visualizeRoute
  ],
};
