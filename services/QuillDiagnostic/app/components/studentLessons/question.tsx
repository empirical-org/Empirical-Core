declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Question from '../../libs/question';
import Textarea from 'react-textarea-autosize';
import * as _ from 'underscore';
import {
  hashToCollection,
  SentenceFragments,
  MultipleChoice,
  ThankYou,
  ConceptExplanation
} from 'quill-component-library/dist/componentLibrary';
import { submitResponse, clearResponses } from '../../actions.js';
import pathwayActions from '../../actions/pathways';
var C = require('../../constants').default;
import rootRef from '../../libs/firebase';
const sessionsRef = rootRef.child('sessions');
var C = require('../../constants').default;
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import RenderQuestionCues from '../renderForQuestions/cues.jsx';
import RenderFeedback from '../renderForQuestions/feedback';
import generateFeedbackString from '../renderForQuestions/generateFeedbackString.js';
import getResponse from '../renderForQuestions/checkAnswer';
import handleFocus from '../renderForQuestions/handleFocus.js';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import submitPathway from '../renderForQuestions/submitPathway.js';
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx';
import { getOptimalResponses, getSubOptimalResponses, getTopOptimalResponse } from '../../libs/sharedResponseFunctions';
import {
  getResponsesWithCallback,
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
import {Response} from 'quill-marking-logic'
const StateFinished = ThankYou

const feedbackStrings = C.FEEDBACK_STRINGS;

const playLessonQuestion = React.createClass<any, any>({
  getInitialState() {
    return {
      editing: false,
      response: '',
      finished: false,
      multipleChoice: false,
    };
  },

  componentDidMount() {
    getGradedResponsesWithCallback(
      this.props.question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.question !== nextProps.question) {
      return true;
    } else if (this.state.response !== nextState.response) {
      return true;
    } else if (this.state.finished !== nextState.finished) {
      return true;
    } else if (this.state.multipleChoice !== nextState.multipleChoice) {
      return true;
    } else if (this.state.responses !== nextState.responses) {
      return true;
    }
    return false;
  },

  getInitialValue() {
    if (this.props.prefill) {
      return this.getQuestion().prefilledText;
    }
  },

  removePrefilledUnderscores() {
    this.setState({ response: this.state.response.replace(/_/g, ''), });
  },

  getQuestion() {
    return this.props.question;
  },

  getResponse2(rid) {
    return (this.getResponses()[rid]);
  },

  getResponses() {
    return this.state.responses;
  },

  getQuestionMarkerFields() {
    return ({
      prompt: this.getQuestion().prompt,
      responses: hashToCollection(this.getResponses()),
    });
  },

  getNewQuestionMarker() {
    const fields = this.getQuestionMarkerFields();
    return new Question(fields);
  },

  getOptimalResponses() {
    return getOptimalResponses(hashToCollection(this.getResponses()));
  },

  getSubOptimalResponses() {
    return getSubOptimalResponses(hashToCollection(this.getResponses()));
  },

  get4MarkedResponses() {
    const twoOptimal = _.first(_.shuffle(this.getOptimalResponses()), 2);
    const twoSubOptimal = _.first(_.shuffle(this.getSubOptimalResponses()), 2);
    return _.shuffle(twoOptimal.concat(twoSubOptimal));
  },

  submitResponse(response) {
    submitQuestionResponse(response, this.props, this.state.sessionKey, submitResponse);
  },

  renderSentenceFragments() {
    return <SentenceFragments prompt={this.getQuestion().prompt} />;
  },

  listCuesAsString(cues) {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  },

  renderFeedback(override) {
    let sentence;
    if (override) {
      sentence = override;
    } else if (this.getQuestion() && this.getQuestion().modelConceptUID) {
      sentence = 'Revise your work. Use the hint below as an example.';
    } else {
      sentence = 'Keep writing! Revise your sentence by changing the order of the ideas.';
    }
    return (<RenderFeedback
      getQuestion={this.getQuestion}
      listCuesAsString={this.listCuesAsString}
      override={!!override}
      question={this.props.question}
      renderFeedbackStatements={this.renderFeedbackStatements}
      responses={this.getResponses()}
      sentence={sentence}
    />);
  },

  getErrorsForAttempt(attempt) {
    return _.pick(attempt, ...C.ERROR_TYPES);
  },

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  },

  renderCues() {
    return (<RenderQuestionCues
      displayArrowAndText={true}
      getQuestion={this.getQuestion}
    />);
  },

  updateResponseResource(response) {
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, this.props.dispatch);
  },

  submitPathway(response) {
    submitPathway(response, this.props);
  },

  answeredCorrectly() {
    const question = this.getQuestion();
    const latestAttempt = getLatestAttempt(question.attempts);
    const errorsForAttempt = _.keys(this.getErrorsForAttempt(latestAttempt)).length > 0;
    return (latestAttempt && latestAttempt.response && !errorsForAttempt && latestAttempt.response.optimal);
  },

  checkAnswer(e) {
    if (this.state.editing) {
      this.removePrefilledUnderscores();
      const response = getResponse(this.getQuestion(), this.state.response, this.getResponses());
      this.updateResponseResource(response);
      this.submitResponse(response);
      this.setState({ editing: false, });
    }
  },

  completeMultiChoice() {
    this.setState({ finished: true, });
  },

  toggleDisabled() {
    if (this.state.editing) {
      return '';
    }
    return 'is-disabled';
  },

  handleChange(e) {
    if (e !== this.state.response) {
      this.setState({ editing: true, response: e, });
    }
  },

  readyForNext() {
    if (this.props.question.attempts.length > 0) {
      const latestAttempt = getLatestAttempt(this.props.question.attempts);
      if (latestAttempt && latestAttempt.response) {
        const errors = _.keys(this.getErrorsForAttempt(latestAttempt));
        if (latestAttempt.response.optimal && errors.length === 0) {
          return true;
        }
      }
    }
    return false;
  },

  getProgressPercent() {
    return this.props.question.attempts.length / 3 * 100;
  },

  finish() {
    this.setState({ finished: true, });
  },

  nextQuestion() {
    this.props.nextQuestion();
    this.setState({ response: '', });
  },

  renderNextQuestionButton(correct) {
    return (<button className="button student-next" onClick={this.nextQuestion}>Next Question</button>);
  },

  renderFinishedQuestionButton() {
    const nextF = () => {
      this.setState({ finished: true, });
    };
    return (<button className="button student-next" onClick={nextF}>Next</button>);
  },

  renderMultipleChoiceButton() {
    const nextF = () => {
      this.setState({ multipleChoice: true, });
    };
    return (<button className="button student-next" onClick={nextF}>Next</button>);
  },

  finishQuestion() {
    this.setState({ finished: true, });
  },

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct);
  },

  getNegativeConceptResultForResponse(conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  },

  renderConceptExplanation() {
    const latestAttempt:{response: Response}|undefined = getLatestAttempt(this.props.question.attempts);
    if (latestAttempt) {
      if (!latestAttempt.response.optimal && latestAttempt.response.conceptResults) {
          const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
          if (conceptID) {
            const data = this.props.conceptsFeedback.data[conceptID.conceptUID];
            if (data) {
              return <ConceptExplanation {...data} />;
            }
          }
      } else if (latestAttempt.response && !latestAttempt.response.optimal && latestAttempt.response.concept_results) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
        if (conceptID) {
          const data = this.props.conceptsFeedback.data[conceptID.conceptUID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
      } else if (this.getQuestion() && this.getQuestion().modelConceptUID) {
        const dataF = this.props.conceptsFeedback.data[this.getQuestion().modelConceptUID];
        if (dataF) {
          return <ConceptExplanation {...dataF} />;
        }
      } else if (this.getQuestion().conceptID) {
        const data = this.props.conceptsFeedback.data[this.getQuestion().conceptID];
        if (data) {
          return <ConceptExplanation {...data} />;
        }
      }
    }
  },

  multipleChoiceFinishQuestion() {
    this.setState({ multipleChoiceCorrect: true, }, this.finishQuestion());
  },

  render() {
    const questionID = this.props.question.key;
    if (this.props.question) {
      const sharedProps = {
        value: this.state.response,
        question: this.props.question,
        responses: this.getResponses(),
        getResponse: this.getResponse2,
        feedback: this.renderFeedback(),
        initialValue: this.getInitialValue(),
        key: questionID,
        questionID,
        id: 'playQuestion',
        sentenceFragments: this.renderSentenceFragments(),
        cues: this.renderCues(),
        className: 'fubar',
      };
      let component;
      if (this.state.finished) {
        component = (
          <AnswerForm
            {...sharedProps}
            disabled
            finished
            handleChange={() => {}}
            multipleChoiceCorrect={this.state.multipleChoiceCorrect}
            nextQuestionButton={this.renderNextQuestionButton()}
          />
        );
      } else if (this.state.multipleChoice) {
        component = (
          <MultipleChoice
            answers={this.get4MarkedResponses()}
            next={this.multipleChoiceFinishQuestion}
            prompt={this.renderSentenceFragments()}
          />
        );
      } else if (this.props.question.attempts.length > 4) {
        if (this.answeredCorrectly()) {
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              handleChange={() => {}}
              nextQuestionButton={this.renderFinishedQuestionButton()}
            />
            );
        } else {
          sharedProps.feedback = this.renderFeedback('Nice try. Let’s try a multiple choice question.');
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              handleChange={() => {}}
              nextQuestionButton={this.renderMultipleChoiceButton()}
            />
            );
        }
      } else if (this.props.question.attempts.length > 0) {
        const latestAttempt = getLatestAttempt(this.props.question.attempts);
        if (this.readyForNext()) {
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              handleChange={() => {}}
              nextQuestionButton={this.renderFinishedQuestionButton()}
            />
          );
        } else {
          component = (
            <AnswerForm
              {...sharedProps}
              checkAnswer={this.checkAnswer}
              conceptExplanation={this.renderConceptExplanation}
              handleChange={this.handleChange}
              spellCheck={(this.props.question.attempts.length > 3)}
              toggleDisabled={this.toggleDisabled()}
            />
          );
        }
      } else {
        component = (
          <AnswerForm
            {...sharedProps}
            checkAnswer={this.checkAnswer}
            handleChange={this.handleChange}
            toggleDisabled={this.toggleDisabled()}
          />
        );
      }
      return (
        <div className="student-container-inner-diagnostic">
          {component}
        </div>
      );
    }
    return (<p>Loading...</p>);
  },
});

function getLatestAttempt(attempts:Array<{response: Response}> = []):{response: Response}|undefined {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};

function select(state) {
  return {
    conceptsFeedback: state.conceptsFeedback,
  };
}
export default connect(select)(playLessonQuestion);
