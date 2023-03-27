declare function require(name:string);
import { Response } from 'quill-marking-logic';
import * as React from 'react';
import * as _ from 'underscore';

import {
  ConceptExplanation, getLatestAttempt, hashToCollection, MultipleChoice, SentenceFragments
} from '../../../Shared/index';
import { submitResponse } from '../../actions.js';
import {
  getGradedResponsesWithCallback, getMultipleChoiceResponseOptionsWithCallback
} from '../../actions/responses.js';
import EditCaretPositioning from '../../libs/EditCaretPositioning';
import Question from '../../libs/question';
import getResponse from '../renderForQuestions/checkAnswer';
import RenderQuestionCues from '../renderForQuestions/cues.jsx';
import RenderFeedback from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';

const RenderSentenceFragments = SentenceFragments
const C = require('../../constants').default;

interface PlayLessonQuestionProps {
  conceptsFeedback: any;
  dispatch: () => void;
  isAdmin: boolean;
  isLastQuestion: boolean;
  nextQuestion: () => void;
  onHandleToggleQuestion: (question: any) => void;
  prefill: any;
  previewMode: boolean;
  question: any;
  questionToPreview: any;
  key: any;
}

interface PlayLessonQuestionState {
  editing: boolean;
  response: string;
  responses?: object[];
  finished: boolean;
  multipleChoice: boolean;
  multipleChoiceCorrect?: boolean;
  multipleChoiceResponseOptions?: object[];
  sessionKey?: string;
}

export default class PlayLessonQuestion extends React.Component<PlayLessonQuestionProps,PlayLessonQuestionState> {
  constructor(props) {
    super(props)

    const { question, } = props
    let response = ''
    const numberOfAttempts = question.attempts ? question.attempts.length : null;
    if (numberOfAttempts) {
      const lastSubmitted = question.attempts[numberOfAttempts - 1]
      response =  lastSubmitted.response.text
    }

    this.state = {
      editing: false,
      response,
      finished: false,
      multipleChoice: false
    }
  }

  componentDidMount() {
    const { question } = this.props;
    getGradedResponsesWithCallback(
      question.key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
    getMultipleChoiceResponseOptionsWithCallback(
      question.key,
      (data) => {
        this.setState({ multipleChoiceResponseOptions: _.shuffle(data), });
      }
    );
  }

  shouldComponentUpdate(nextProps: PlayLessonQuestionProps, nextState: PlayLessonQuestionState) {
    const { question, } = this.props
    const { response, finished, multipleChoice, responses} = this.state
    if (question !== nextProps.question) {
      return true;
    } else if (response !== nextState.response) {
      return true;
    } else if (finished !== nextState.finished) {
      return true;
    } else if (multipleChoice !== nextState.multipleChoice) {
      return true;
    } else if (responses !== nextState.responses) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    const { question } = this.props;
    if(prevProps.question !== question) {
      getMultipleChoiceResponseOptionsWithCallback(
        question.key,
        (data) => {
          this.setState({ multipleChoiceResponseOptions: _.shuffle(data), });
        }
      );
    }
  }

  getInitialValue = () => {
    const { prefill, question } = this.props
    if (prefill) {
      return question.prefilledText;
    }
  }

  removePrefilledUnderscores = () => {
    const { response, } = this.state
    this.setState({ response: response.replace(/_/g, ''), });
  }

  getQuestion = () => {
    const { question } = this.props;
    return question
  }

  getResponse2(rid) {
    return (this.getResponses()[rid]);
  }

  getResponses = () => {
    const { responses, } = this.state
    return responses;
  }

  getQuestionMarkerFields = () => {
    const { question } = this.props;
    return ({
      prompt: question.prompt,
      responses: hashToCollection(this.getResponses()),
    });
  }

  getNewQuestionMarker = () => {
    const fields = this.getQuestionMarkerFields();
    return new Question(fields);
  }

  submitResponse(response) {
    const { sessionKey, } = this.state
    submitQuestionResponse(response, this.props, sessionKey, submitResponse);
  }

  renderSentenceFragments = () => {
    const { question } = this.props;
    return <RenderSentenceFragments prompt={question.prompt} />;
  }

  listCuesAsString = (cues: string[]) => {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  }

  renderFeedback = (override?: string) => {
    const { question, previewMode } = this.props;
    let sentence;
    if (override) {
      sentence = override;
    } else if (question && question.modelConceptUID) {
      sentence = 'Revise your work. Use the hint below as an example.';
    } else {
      sentence = 'Keep writing! Revise your sentence by changing the order of the ideas.';
    }
    return (
      <RenderFeedback
        listCuesAsString={this.listCuesAsString}
        override={!!override}
        previewMode={previewMode}
        question={question}
        renderFeedbackStatements={this.renderFeedbackStatements}
        responses={this.getResponses()}
        sentence={sentence}
      />
    );
  }

  getErrorsForAttempt = () => {
    const questionAttempt = this.handleGetLatestAttempt();
    return _.pick(questionAttempt, ...C.ERROR_TYPES);
  }

  renderFeedbackStatements = () => {
    const questionAttempt = this.handleGetLatestAttempt();
    return <RenderQuestionFeedback attempt={questionAttempt} />;
  }

  renderCues = () => {
    const { question } = this.props;
    return (
      <RenderQuestionCues
        displayArrowAndText={true}
        question={question}
      />
    );
  }

  updateResponseResource(response) {
    const { dispatch, question } = this.props
    updateResponseResource(response, question.key, question.attempts, dispatch);
  }

  answeredCorrectly = () => {
    const latestAttempt = this.handleGetLatestAttempt();
    const errorsForAttempt = _.keys(this.getErrorsForAttempt()).length > 0;
    return (latestAttempt && latestAttempt.response && !errorsForAttempt && latestAttempt.response.optimal);
  }

  checkAnswer = (e: React.SyntheticEvent) => {
    const { question } = this.props;
    const { editing, response, } = this.state
    if (editing && this.getResponses() && Object.keys(this.getResponses()).length) {
      this.removePrefilledUnderscores();
      const submittedResponse = getResponse(question, response, this.getResponses());
      this.updateResponseResource(submittedResponse);
      this.submitResponse(submittedResponse);
      this.setState({ editing: false });
    }
  }

  completeMultiChoice = () => {
    this.setState({ finished: true, });
  }

  toggleDisabled = () => {
    const { editing, } = this.state
    if (editing && this.getResponses() && Object.keys(this.getResponses()).length) {
      return '';
    }
    return 'disabled';
  }

  onChange = (e: string, element: React.ReactElement) => {
    const { response, } = this.state
    if (e !== response) {
      const caretPosition = EditCaretPositioning.saveSelection(element)
      this.setState({ editing: true, response: e, }, () => EditCaretPositioning.restoreSelection(element, caretPosition))
    }
  }

  readyForNext = () => {
    const { question, previewMode } = this.props
    const hasAttemptsOrIsPreview = (question.attempts && question.attempts.length > 0) || previewMode;
    if(!hasAttemptsOrIsPreview) {
      return false;
    }
    const latestAttempt = this.handleGetLatestAttempt();
    if (latestAttempt && latestAttempt.response) {
      const errors = _.keys(this.getErrorsForAttempt());
      return latestAttempt.response.optimal && errors.length === 0;
    }
  }

  getProgressPercent = () => {
    const { question, } = this.props

    return question.attempts.length / 3 * 100;
  }

  getDisabledStatus = () => {
    const { previewMode, isLastQuestion } = this.props;
    return previewMode && isLastQuestion
  }

  finish = () => {
    this.setState({ finished: true, });
  }

  handleNextQuestionClick = () => {
    const { nextQuestion, } = this.props

    nextQuestion();
    this.setState({ response: '', });
  }

  renderNextQuestionButton = () => {
    const { isLastQuestion, } = this.props
    const buttonText = isLastQuestion ? 'Next' : 'Next question'
    const disabledStatus = this.getDisabledStatus();
    const disabledStyle = disabledStatus ? 'disabled' : '';
    return (<button className={`quill-button focus-on-light primary contained large ${disabledStyle}`} disabled={disabledStatus} onClick={this.handleNextQuestionClick} type="button">{buttonText}</button>);
  }

  renderFinishedQuestionButton = () => {
    const nextF = () => {
      this.setState({ finished: true, });
    };
    return (<button className="quill-button focus-on-light primary contained large" onClick={nextF} type="button">Next</button>);
  }

  renderMultipleChoiceButton = () => {
    const nextF = () => {
      this.setState({ multipleChoice: true, });
    };
    return (<button className="quill-button focus-on-light primary contained large" onClick={nextF} type="button">Next</button>);
  }

  finishQuestion = () => {
    this.setState({ finished: true, });
  }

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct);
  }

  renderConceptExplanation = () => {
    const { conceptsFeedback, question } = this.props
    //TODO: update Response interface in quill-marking-logic to fix Boolean/boolean type checking
    const latestAttempt:{response: Response}|undefined = this.handleGetLatestAttempt();

    // we do not want to show concept feedback if a response is optimal
    if (!latestAttempt || !latestAttempt.response || latestAttempt.response.optimal) { return }

    if (latestAttempt.response.author || [true, false].includes(latestAttempt.response.optimal)) {
      // we only want to show response-specific (ie, concept-result-specific) concept feedback if the response is matched
      // The presence of 'author' indicates a match via algorithm, and an explicitly-set 'optimal' property indicates a match via explicit human grading

      if (latestAttempt.response.conceptResults) {
        const negativeConcepts = this.getNegativeConceptResultsForResponse(latestAttempt.response.conceptResults);
        const negativeConceptWithConceptFeedback = negativeConcepts.find(c => {
          return conceptsFeedback.data[c.conceptUID]
        })
        if (negativeConceptWithConceptFeedback) {
          return <ConceptExplanation {...conceptsFeedback.data[negativeConceptWithConceptFeedback.conceptUID]} />
        }
      }

      if (latestAttempt.response.concept_results) {
        const negativeConcepts = this.getNegativeConceptResultsForResponse(latestAttempt.response.concept_results);
        const negativeConceptWithConceptFeedback = negativeConcepts.find(c => {
          return conceptsFeedback.data[c.conceptUID]
        })
        if (negativeConceptWithConceptFeedback) {
          return <ConceptExplanation {...conceptsFeedback.data[negativeConceptWithConceptFeedback.conceptUID]} />
        }
      }

    } else {
      // we only want to show question-level concept feedback if the response is unmatched
      if (question && question.modelConceptUID) {
        const dataF = conceptsFeedback.data[question.modelConceptUID];
        if (dataF) {
          return <ConceptExplanation {...dataF} />;
        }
      }

      if (question.conceptID) {
        const data = conceptsFeedback.data[question.conceptID];
        if (data) {
          return <ConceptExplanation {...data} />;
        }
      }

    }
  }

  multipleChoiceFinishQuestion = () => {
    this.setState({ multipleChoiceCorrect: true, }, () => {
      this.finishQuestion();
    });
  }

  handleGetLatestAttempt = () => {
    const { question } = this.props;
    const latestAttempt = getLatestAttempt(question.attempts);
    return latestAttempt;
  }

  render() {
    const { question, isAdmin, previewMode } = this.props
    const { response, finished, multipleChoice, multipleChoiceCorrect, multipleChoiceResponseOptions  } = this.state
    const questionID = question.key;

    if (question) {
      const sharedProps = {
        value: response,
        question,
        isAdmin,
        response,
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
        previewMode
      };
      let component;
      const maxAttemptsSubmitted = question.attempts && question.attempts.length > 4;
      const someAttemptsSubmitted = question.attempts && question.attempts.length > 0;
      if (finished) {
        component = (
          <AnswerForm
            {...sharedProps}
            disabled
            finished
            multipleChoiceCorrect={multipleChoiceCorrect}
            nextQuestionButton={this.renderNextQuestionButton()}
          />
        );
      } else if (multipleChoice) {
        component = (
          <MultipleChoice
            answers={multipleChoiceResponseOptions}
            next={this.multipleChoiceFinishQuestion}
            prompt={this.renderSentenceFragments()}
          />
        );
      } else if (maxAttemptsSubmitted) {
        if (this.answeredCorrectly()) {
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              nextQuestionButton={this.renderFinishedQuestionButton()}
            />
          );
        } else {
          sharedProps.feedback = this.renderFeedback('Nice try. Let’s try a multiple choice question.');
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              nextQuestionButton={this.renderMultipleChoiceButton()}
            />
          );
        }
      } else if (someAttemptsSubmitted) {
        if (this.readyForNext()) {
          component = (
            <AnswerForm
              {...sharedProps}
              disabled
              nextQuestionButton={this.renderFinishedQuestionButton()}
            />
          );
        } else {
          component = (
            <AnswerForm
              {...sharedProps}
              checkAnswer={this.checkAnswer}
              conceptExplanation={this.renderConceptExplanation}
              handleChange={this.onChange}
              spellCheck={(question.attempts && question.attempts.length > 3)}
              toggleDisabled={this.toggleDisabled()}
            />
          );
        }
      } else {
        component = (
          <AnswerForm
            {...sharedProps}
            checkAnswer={this.checkAnswer}
            handleChange={this.onChange}
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
  }
}
