import IncorrectSequenceContainer from 'components/incorrectSequence/sentenceFragments/incorrectSequenceContainer.jsx';
import EditIncorrectSequenceContainer from 'components/incorrectSequence/sentenceFragments/editIncorrectSequenceContainer.jsx';
import NewIncorrectSequenceContainer from 'components/incorrectSequence/sentenceFragments/newIncorrectSequenceContainer.jsx';

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
