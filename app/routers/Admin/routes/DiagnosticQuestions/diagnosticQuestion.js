import DiagnosticQuestion from 'components/diagnosticQuestions/diagnosticQuestion.jsx';
import ResponsesRoute from 'routers/Admin/routes/Shared/responses';
import MassEditRoute from 'routers/Admin/routes/Shared/massEdit';
import TestQuestionContainer from 'components/diagnosticQuestions/testDiagnosticQuestion'

const testQuestion = {
  path: 'test',
  component: TestQuestionContainer,
};

export default {
  path: ':questionID',
  component: DiagnosticQuestion,
  indexRoute: {
    onEnter: ({ params, }, replace) => replace(`admin/diagnostic-questions/${params.questionID}/responses`),
  },
  childRoutes: [
    ResponsesRoute,
    MassEditRoute,
    testQuestion
  ],
};
