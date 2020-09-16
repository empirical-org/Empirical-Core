import * as React from 'react';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import * as _ from 'underscore';
import {checkSentenceFragment, Response } from 'quill-marking-logic'
import Feedback from '../renderForQuestions/feedback';
import RenderQuestionFeedback from '../renderForQuestions/feedbackStatements.jsx';
import {
  hashToCollection,
  ConceptExplanation
} from 'quill-component-library/dist/componentLibrary';
import {
  getGradedResponsesWithCallback
} from '../../actions/responses';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import POSMatcher from '../../libs/sentenceFragment';
import { SentenceFragmentQuestion } from '../../interfaces/questions';
const icon = `${process.env.CDN_URL}/images/icons/direction.svg`

interface PlaySentenceFragmentProps {
  question: SentenceFragmentQuestion;
  dispatch: () => void;
  updateAttempts: (response: object) => void;
  previewMode: boolean;
  previewAttempt: any;
  questionToPreview: SentenceFragmentQuestion;
  markIdentify: (boolean: boolean) => void;
  currentKey: string;
  conceptsFeedback: any;
  nextQuestion: () => void;
}

interface PlaySentenceFragmentState {
  editing: boolean;
  checkAnswerEnabled: boolean;
  response: string;
  responses?: object[];
  previewAttempt: any;
  previewAttemptSubmitted: boolean;
  previewSubmissionCount: number;
  previewSentenceOrFragmentSelected: boolean;
}

class PlaySentenceFragment extends React.Component<PlaySentenceFragmentProps, PlaySentenceFragmentState> {
  constructor(props) {
    super(props)

    const { question } = props
    let response = ''
    if (question && question.attempts && question.attempts.length) {
      const attemptLength = question.attempts.length
      const lastSubmission = question.attempts[attemptLength - 1]
      response = lastSubmission.response.text
    } else if (question) {
      response = question.prompt
    }

    this.state = {
      response,
      checkAnswerEnabled: true,
      editing: false,
      previewAttempt: null,
      previewAttemptSubmitted: false,
      previewSubmissionCount: 0,
      previewSentenceOrFragmentSelected: false
    }
  }

  componentDidMount() {
    const { question } = this.props
    const { responses, } = this.state
    if (question && !responses) {
      getGradedResponsesWithCallback(
        question.key,
        (data) => {
          this.setState({ responses: data, });
        }
      )
    }
  }

  shouldComponentUpdate(nextProps: PlaySentenceFragmentProps, nextState: PlaySentenceFragmentState) {
    const { question, } = this.props
    const { response, responses, previewAttempt, previewAttemptSubmitted, previewSubmissionCount, previewSentenceOrFragmentSelected } = this.state
    if (question !== nextProps.question) {
      return true;
    } else if (response !== nextState.response) {
      return true;
    } else if (responses !== nextState.responses) {
      return true;
    } else if(previewAttempt !== nextState.previewAttempt) {
      return true;
    } else if(previewAttemptSubmitted !== nextState.previewAttemptSubmitted) {
      return true;
    } else if(previewSubmissionCount !== nextState.previewSubmissionCount) {
      return true;
    } else if(previewSentenceOrFragmentSelected !== nextState.previewSentenceOrFragmentSelected) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps: PlaySentenceFragmentProps) {
    const { question, } = this.props;
    const attemptsLength = prevProps.question.attempts ? prevProps.question.attempts.length : null;
    if (question.attempts && question.attempts.length !== attemptsLength) {
      this.setState({editing: false})
    }
  }


  showNextQuestionButton = () => {
    const { previewSubmissionCount } = this.state;
    const { question, previewMode } = this.props;
    const latestAttempt = this.getLatestAttempt();
    const maxAttempts = (question.attempts && question.attempts.length > 4) || (previewMode && previewSubmissionCount > 4);
    const readyForNext = maxAttempts || (latestAttempt && latestAttempt.response.optimal);
    return readyForNext;
  }

  getLatestAttempt = ():{response:Response}|undefined => {
    const { previewAttempt } = this.state;
    const { question } = this.props;
    if(previewAttempt) {
      return previewAttempt;
    }
    return _.last(question.attempts || []);
  }

  getQuestion = () => {
    const { question, previewMode, questionToPreview } = this.props;
    if(previewMode && questionToPreview) {
      return questionToPreview;
    }
    return question
  }

  handleClickCompleteSentence = () => this.checkChoice('Sentence')

  handleClickIncompleteSentence = () => this.checkChoice('Fragment')

  checkChoice(choice: string) {
    const { markIdentify, previewMode } = this.props
    const question = this.getQuestion();
    const questionType = question.isFragment ? 'Fragment' : 'Sentence';
    if(previewMode) {
      this.setState({ previewSentenceOrFragmentSelected: true });
    }
    markIdentify(choice === questionType);
  }

  renderSentenceOrFragmentButtons = () => {
    return (
      <div className="sf-button-group">
        <button className="button sf-button focus-on-light" onClick={this.handleClickCompleteSentence} type="button" value="Sentence">Complete Sentence</button>
        <button className="button sf-button focus-on-light" onClick={this.handleClickIncompleteSentence} type="button" value="Fragment">Incomplete Sentence</button>
      </div>
    );
  }

  choosingSentenceOrFragment = () => {
    const { previewSentenceOrFragmentSelected } = this.state;
    const { previewMode } = this.props;
    const question = this.getQuestion();
    if(previewMode && previewSentenceOrFragmentSelected) {
      return false;
    }
    return question.identified === undefined && (question.needsIdentification === undefined || question.needsIdentification === true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  }

  handleChange = (e: string) => {
    this.setState({
      response: e,
      editing: true,
    });
  }

  handleCheckSentenceFragment = ({ fields, key, attempts, response }) => {
    const { dispatch, updateAttempts, previewMode } = this.props
    checkSentenceFragment(fields).then((resp) => {
      if(previewMode) {
        const responseMatcher = new POSMatcher(fields);
        const submittedResponse = responseMatcher.checkMatch(response);
        this.setState(prevState => ({ 
          previewAttempt: submittedResponse, 
          previewAttemptSubmitted: true, 
          previewSubmissionCount: prevState.previewSubmissionCount + 1 
        }));
      }
      const matched = {response: resp}
      if (typeof(matched) === 'object') {
        updateResponseResource(matched, key, attempts, dispatch, );
        updateAttempts(matched);
        this.setState({ checkAnswerEnabled: true, });
      }
    })
  }

  handleResponseSubmission = () => {
    const { checkAnswerEnabled, responses, response } = this.state
    const { currentKey, question, previewMode, questionToPreview } = this.props
    if (checkAnswerEnabled && responses) {
      const key = previewMode && questionToPreview ? questionToPreview.key : currentKey;
      const { attempts } = question;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const { prompt, wordCountChange, ignoreCaseAndPunc, incorrectSequences, focusPoints, modelConceptUID, concept_uid, conceptID } = this.getQuestion();
        const hashedResponses = hashToCollection(responses)
        const defaultConceptUID = modelConceptUID || concept_uid || conceptID
        const fields = {
          question_uid: key,
          response: response,
          checkML: true,
          mlUrl: 'https://nlp.quill.org',
          responses: hashedResponses,
          wordCountChange,
          ignoreCaseAndPunc,
          prompt,
          focusPoints,
          incorrectSequences,
          defaultConceptUID
        }
        this.handleCheckSentenceFragment({ fields, key, attempts, response });
      });
    }
  }

  getNegativeConceptResultsForResponse(conceptResults) {
    return hashToCollection(conceptResults).filter(cr => !cr.correct)
  }

  getNegativeConceptResultForResponse(conceptResults) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  //TODO: refactor renderConceptExplanation function

  renderConceptExplanation = () => {
    const { conceptsFeedback, } = this.props
    if (!this.showNextQuestionButton()) {
      const latestAttempt:{response: Response}|undefined  = this.getLatestAttempt();
      if (latestAttempt && latestAttempt.response && !latestAttempt.response.optimal) {
        if (latestAttempt.response.conceptResults) {
            const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.conceptResults);
            if (conceptID) {
              const data = conceptsFeedback.data[conceptID.conceptUID];
              if (data) {
                return <ConceptExplanation {...data} />;
              }
            }
        } else if (latestAttempt.response.concept_results) {
          const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.response.concept_results);
          if (conceptID) {
            const data = conceptsFeedback.data[conceptID.conceptUID];
            if (data) {
              return <ConceptExplanation {...data} />;
            }
          }
        } else if (this.getQuestion() && this.getQuestion().modelConceptUID) {
          const dataF = conceptsFeedback.data[this.getQuestion().modelConceptUID];
          if (dataF) {
            return <ConceptExplanation {...dataF} />;
          }
        } else if (this.getQuestion().conceptID) {
          const data = conceptsFeedback.data[this.getQuestion().conceptID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
      }
    }
  }

  renderSentenceOrFragmentMode = () => {
    return (
      <div className="container">
        <div className="feedback-row">
          <img alt="Directions Icon" className="info" src={icon} />
          <p>Is this a complete or an incomplete sentence?</p>
        </div>
        {this.renderSentenceOrFragmentButtons()}
      </div>
    );
  }

  renderButton = () => {
    const { responses, previewSubmissionCount } = this.state
    const { nextQuestion, question, previewMode } = this.props;
    let showRecheckWorkButton;
    if(previewMode) {
      showRecheckWorkButton = previewSubmissionCount > 0;
    } else {
      showRecheckWorkButton = question && question.attempts ? question.attempts.length > 0 : false
    }
    if (this.showNextQuestionButton()) {
      return <button className="quill-button focus-on-light large primary contained" onClick={nextQuestion} type="button">Next</button>;
    } else if (responses) {
      if (showRecheckWorkButton) {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Recheck work</button>;
      } else {
        return <button className="quill-button focus-on-light large primary contained" onClick={this.handleResponseSubmission} type="button">Submit</button>;
      }
    } else {
      return <button className="quill-button focus-on-light large primary contained disabled" type="button">Submit</button>;
    }
  }

  renderFeedbackStatements(attempt) {
    return <RenderQuestionFeedback attempt={attempt} getQuestion={this.getQuestion} />;
  }

  renderPlaySentenceFragmentMode = () => {
    const question = this.getQuestion();
    const { previewMode } = this.props;
    const { response, responses, previewAttempt, previewAttemptSubmitted } = this.state
    let instructions;
    const latestAttempt = this.getLatestAttempt();
    if (latestAttempt) {
      const component = <span dangerouslySetInnerHTML={{__html: latestAttempt.response.feedback}} />
      instructions = latestAttempt.response.feedback ? component :
      'Revise your work. A complete sentence must have an action word and a person or thing doing the action.';
    } else if (question.instructions && question.instructions !== '') {
      instructions = question.instructions;
    } else {
      instructions = 'If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.';
    }
    // dangerously set some html in here
    return (
      <div className="container">
        <Feedback
          getQuestion={this.getQuestion}
          previewAttempt={previewAttempt}
          previewAttemptSubmitted={previewAttemptSubmitted}
          previewMode={previewMode}
          question={question}
          renderFeedbackStatements={this.renderFeedbackStatements}
          responses={responses}
          sentence={instructions}
        />
        <TextEditor
          disabled={this.showNextQuestionButton()}
          onChange={this.handleChange}
          onSubmitResponse={this.handleResponseSubmission}
          placeholder="Type your answer here."
          questionID={question.key}
          value={response}
        />
        <div className="question-button-group">
          {this.renderButton()}
        </div>
        {this.renderConceptExplanation()}
      </div>
    );
  }

  renderInteractiveComponent = () => {
    if (this.choosingSentenceOrFragment()) {
      return this.renderSentenceOrFragmentMode();
    } else {
      return this.renderPlaySentenceFragmentMode();
    }
  }

  render() {
    const { question, } = this.props
    if (!question) { return (<div className="container">Loading...</div>) }

    return (
      <div className="student-container-inner-diagnostic">
        <div className="draft-js sentence-fragments prevent-selection">
          <p>{this.getQuestion() ? this.getQuestion().prompt : ''}</p>
        </div>
        {this.renderInteractiveComponent()}
      </div>
    );
  }
}

export default PlaySentenceFragment
