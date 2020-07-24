import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import _ from 'underscore';
import pathwayActions from '../../actions/pathways';

function getQuestion(props, playQuestion) {
  if (playQuestion === 'play') {
    const { data, } = props.questions,
      { questionID, } = props.params;
    return (data[questionID]);
  } else {
    return props.question;
  }
}

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

export default function submitPathway(response, props, playQuestion) {
  const data = {};
  let previousAttempt;
  const responses = hashToCollection(getQuestion(props, quesType).responses);
  const preAtt = getLatestAttempt(props.question.attempts);

  if (preAtt) { previousAttempt = _.find(responses, { text: getLatestAttempt(props.question.attempts).submitted, }); }
  const newAttempt = _.find(responses, { text: response.submitted, });

  if (previousAttempt) {
    data.fromResponseID = previousAttempt.key;
  }

  if (newAttempt) {
    data.toResponseID = newAttempt.key;

    if (playQuestion === 'play') {
      data.questionID = props.params.questionID;
    } else {
      data.props.question.key = props.question.key;
    }

    data.props.question.key = props.question.key;
    props.dispatch(pathwayActions.submitNewPathway(data));
  }
}
