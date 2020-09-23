declare function require(name:string);
import * as React from 'react';
import * as _ from 'underscore';
import {Response} from 'quill-marking-logic'
import {
  SentenceFragments,
  ConceptExplanation,
} from 'quill-component-library/dist/componentLibrary';

import { MultipleChoice, hashToCollection, } from '../../../Shared/index'
import { submitResponse } from '../../actions.js';
import Question from '../../libs/question';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import RenderQuestionCues from '../renderForQuestions/cues.jsx';
import RenderFeedback from '../renderForQuestions/feedback';
import getResponse from '../renderForQuestions/checkAnswer';
import submitQuestionResponse from '../renderForQuestions/submitResponse.js';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import AnswerForm from '../renderForQuestions/renderFormForAnswer.jsx';
import {
  getMultipleChoiceResponseOptionsWithCallback,
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
import EditCaretPositioning from '../../libs/EditCaretPositioning';
import { Attempt } from '../renderForQuestions/answerState.js';

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
  previewAttempt: object;
  previewAttemptSubmitted: boolean;
  previewSubmissionCount: number;
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
      multipleChoice: false,
      previewAttempt: null,
      previewAttemptSubmitted: false,
      previewSubmissionCount: 0
    }
  }

  componentDidMount() {
    const question = this.getQuestion();
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
    const { response, finished, multipleChoice, responses, previewAttempt, previewAttemptSubmitted, previewSubmissionCount } = this.state
    if (question !== nextProps.question) {
      return true;
    } else if (response !== nextState.response) {
      // reset previewAttemptSubmitted for renderFeedback check for previewMode
      this.setState({ previewAttemptSubmitted: false });
      return true;
    } else if (finished !== nextState.finished) {
      return true;
    } else if (multipleChoice !== nextState.multipleChoice) {
      return true;
    } else if (responses !== nextState.responses) {
      return true;
    } else if(previewAttempt !== nextState.previewAttempt) {
      return true;
    } else if(previewAttemptSubmitted !== nextState.previewAttemptSubmitted) {
      return true;
    } else if(previewSubmissionCount !== nextState.previewSubmissionCount) {
      return true;
    }
    return false;
  }

  getInitialValue = () => {
    const { prefill, } = this.props
    if (prefill) {
      return this.getQuestion().prefilledText;
    }
  }

  removePrefilledUnderscores = () => {
    const { response, } = this.state
    this.setState({ response: response.replace(/_/g, ''), });
  }

  getQuestion = () => {
    const { question, previewMode, questionToPreview } = this.props;
    if(previewMode && questionToPreview) {
      return questionToPreview;
    }
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
    return ({
      prompt: this.getQuestion().prompt,
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
    return <RenderSentenceFragments prompt={this.getQuestion().prompt} />;
  }

  listCuesAsString = (cues: string[]) => {
    const newCues = cues.slice(0);
    return `${newCues.splice(0, newCues.length - 1).join(', ')} or ${newCues.pop()}.`;
  }

  renderFeedback = (override?: string) => {
    const { question, previewMode } = this.props;
    const { previewAttempt } = this.state;
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
      previewAttempt={previewAttempt}
      previewMode={previewMode}
      question={question}
      renderFeedbackStatements={this.renderFeedbackStatements}
      responses={this.getResponses()}
      sentence={sentence}
    />);
  }

  getQuestionAttempt = (attempt: Attempt) => {
    const { previewAttempt } = this.state;
    const { previewMode } = this.props;
    return previewMode && previewAttempt ? previewAttempt : attempt;
  }

  getErrorsForAttempt = (attempt: Attempt) => {
    const questionAttempt = this.getQuestionAttempt(attempt);
    return _.pick(questionAttempt, ...C.ERROR_TYPES);
  }

  renderFeedbackStatements = (attempt: Attempt) => {
    const questionAttempt = this.getQuestionAttempt(attempt);
    return <RenderQuestionFeedback attempt={questionAttempt} getErrorsForAttempt={this.getErrorsForAttempt} getQuestion={this.getQuestion} />;
  }

  renderCues = () => {
    return (<RenderQuestionCues
      displayArrowAndText={true}
      getQuestion={this.getQuestion}
    />);
  }

  updateResponseResource(response) {
    const { dispatch, } = this.props
    updateResponseResource(response, this.getQuestion().key, this.getQuestion().attempts, dispatch);
  }

  answeredCorrectly = () => {
    const latestAttempt = this.handleGetLatestAttempt();
    const errorsForAttempt = _.keys(this.getErrorsForAttempt(latestAttempt)).length > 0;
    return (latestAttempt && latestAttempt.response && !errorsForAttempt && latestAttempt.response.optimal);
  }

  checkAnswer = (e: React.SyntheticEvent) => {
    const { previewMode } = this.props;
    const { editing, response, } = this.state
    if (editing && this.getResponses() && Object.keys(this.getResponses()).length) {
      this.removePrefilledUnderscores();
      const submittedResponse = getResponse(this.getQuestion(), response, this.getResponses());
      this.updateResponseResource(submittedResponse);
      this.submitResponse(submittedResponse);
      this.setState({ editing: false });
      if(previewMode) {
        this.setState(prevState => ({ 
          previewAttempt: submittedResponse, 
          previewAttemptSubmitted: true, 
          previewSubmissionCount: prevState.previewSubmissionCount + 1 
        }));
      }
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
      const errors = _.keys(this.getErrorsForAttempt(latestAttempt));
      return latestAttempt.response.optimal && errors.length === 0;
    }
  }

  getProgressPercent = () => {
    const { question, } = this.props

    return question.attempts.length / 3 * 100;
  }

  getDisabledStatus = () => {
    const { previewMode, isLastQuestion } = this.props;
    const { previewSubmissionCount, previewAttempt } = this.state;
    return previewMode && isLastQuestion && (previewSubmissionCount === 5 || previewAttempt.optimal);
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
    const { conceptsFeedback, } = this.props
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
      if (this.getQuestion() && this.getQuestion().modelConceptUID) {
        const dataF = conceptsFeedback.data[this.getQuestion().modelConceptUID];
        if (dataF) {
          return <ConceptExplanation {...dataF} />;
        }
      }

      if (this.getQuestion().conceptID) {
        const data = conceptsFeedback.data[this.getQuestion().conceptID];
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
    const { previewAttempt } = this.state;
    const { previewMode } = this.props;
    const question = this.getQuestion();
    let latestAttempt
    if(previewMode && previewAttempt) {
      latestAttempt = previewAttempt;
    } else {
      latestAttempt = getLatestAttempt(question.attempts);
    }
    return latestAttempt;
  }

  render() {
    const { question, isAdmin, previewMode } = this.props
    const { response, finished, multipleChoice, multipleChoiceCorrect, multipleChoiceResponseOptions, previewAttempt, previewAttemptSubmitted, previewSubmissionCount } = this.state
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
        previewAttempt, 
        previewAttemptSubmitted, 
        previewMode
      };
      let component;
      const maxAttemptsSubmitted = (question.attempts && question.attempts.length > 4) || (previewSubmissionCount > 4);
      const someAttemptsSubmitted = (question.attempts && question.attempts.length > 0) || previewMode;
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

function getLatestAttempt(attempts:Array<{response: Response}> = []):{response: Response}|undefined {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex];
};
