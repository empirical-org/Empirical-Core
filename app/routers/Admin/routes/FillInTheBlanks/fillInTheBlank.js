import EditFillInBlank from 'components/fillInBlank/editFillInBlank.jsx';
import FillInBlankQuestion from 'components/fillInBlank/fillInBlankQuestion.jsx';
import TestFillInBlankQuestionContainer from 'components/fillInBlank/testFillInBlankQuestionContainer.jsx';
import ResponsesRoute from 'routers/Admin/routes/Shared/responses';
import MassEditRoute from 'routers/Admin/routes/Shared/massEdit';

const testFillInBlank = {
  path: 'test',
  component: TestFillInBlankQuestionContainer,
};

const editFillInBlank = {
  path: 'edit',
  component: EditFillInBlank,
};

export default {
  path: ':questionID',
  component: FillInBlankQuestion,
  indexRoute: {
    onEnter: ({ params, }, replace) => replace(`admin/fill-in-the-blanks/${params.questionID}/responses`),
  },
  childRoutes: [
    ResponsesRoute,
    MassEditRoute,
    testFillInBlank,
    editFillInBlank
  ],
};
