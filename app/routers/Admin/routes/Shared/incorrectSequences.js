import IncorrectSequenceContainer from 'components/incorrectSequence/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from 'components/incorrectSequence/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from 'components/incorrectSequence/newIncorrectSequenceContainer.jsx';

const newIncorrectSequence = {
  path: 'new',
  component: NewIncorrectSequenceContainer,
};

const editIncorrectSequence = {
  path: ':incorrectSequenceID/edit',
  component: EditIncorrectSequenceContainer,
};

export default {
  path: 'incorrect-sequences',
  indexRoute: {
    component: IncorrectSequenceContainer,
  },
  childRoutes: [
    newIncorrectSequence,
    editIncorrectSequence
  ],
};
