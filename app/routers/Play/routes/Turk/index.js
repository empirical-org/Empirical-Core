import Turk from 'components/turk/sentenceFragmentsQuiz.jsx';
import { getParameterByName } from 'libs/getParameterByName';

const route = {
  path: 'turk/:lessonID',
  component: Turk,
};

export default route;
