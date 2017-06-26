import Questions from 'components/questions/questions.jsx';
import Question from 'components/questions/question.jsx';

export default {
  path: 'questions',
  indexRoute: {
    component: Questions,
  },
  childRoutes: [
    {
      path: ':questionID',
      component: Question,
    }
  ],
};
