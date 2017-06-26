import ConceptsFeedback from 'components/feedback/concepts-feedback.jsx';
import ConceptFeedback from 'components/feedback/concept-feedback.jsx';

const conceptFeedbackRoute = {
  path: ':feedbackID',
  component: ConceptFeedback,
};

export default {
  path: 'concepts-feedback',
  indexRoute: {
    component: ConceptsFeedback,
  },
  childRoutes: [
    conceptFeedbackRoute
  ],
};