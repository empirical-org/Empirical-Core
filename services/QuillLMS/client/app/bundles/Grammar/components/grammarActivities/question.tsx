import { ConceptResult, Response } from 'quill-marking-logic';
import * as React from "react";
import ContentEditable from 'react-contenteditable';

import Cues from './cues';

import { getParameterByName } from '../../../Connect/libs/getParameterByName';
import {
  ConceptExplanation,
  Feedback,
  getLatestAttempt, hashToCollection,
  ProgressBar, TeacherPreviewMenuButton
} from '../../../Shared/index';
import * as responseActions from '../../actions/responses';
import { setCurrentQuestion } from '../../actions/session';
import { GrammarActivity } from '../../interfaces/grammarActivities';
import { Question } from '../../interfaces/questions';

const ALLOWED_ATTEMPTS = 5
const UNANSWERED = 'unanswered'
const CORRECTLY_ANSWERED = 'correctly answered'
const FINAL_ATTEMPT = 'final attempt'
const INCORRECTLY_ANSWERED = 'incorrectly answered'

interface QuestionProps {
  activity: GrammarActivity | null;
  answeredQuestions: Question[] | never;
  dispatch: Function;
  unansweredQuestions: Question[] | never;
  currentQuestion: Question;
  goToNextQuestion: Function;
  checkAnswer: Function;
  conceptsFeedback: any;
  concepts: any;
  previewMode: boolean;
  questions: Question[];
  questionSet: Question[];
  handleToggleQuestion: (question: Question) => void;
  isOnMobile: boolean;
  handleTogglePreviewMenu: () => void;
}

interface QuestionState {
  showExample: boolean;
  response: string;
  questionStatus: string;
  submittedEmptyString: boolean;
  submittedForPreview: boolean;
  submittedSameResponseTwice: boolean;
  responses: { [key: number]: Response };
  previewAttempt: any;
}

export class QuestionComponent extends React.Component<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props);

    this.state = {
      showExample: true,
      response: '',
      questionStatus: this.getCurrentQuestionStatus(props.currentQuestion),
      submittedEmptyString: false,
      submittedForPreview: false,
      submittedSameResponseTwice: false,
      responses: {},
      previewAttempt: null
    }
  }

  componentDidMount() {
    const { currentQuestion, } = this.props;
    // preview questions use key as the unique identifier
    const uid = currentQuestion.uid ? currentQuestion.uid : currentQuestion.key;

    responseActions.getGradedResponsesWithCallback(
      uid,
      (data) => {
        this.setState({ responses: data, });
      }
    );

    window.addEventListener('paste', (e) => {
      e.preventDefault()
      return false
    }, true);
  }

  //TODO: refactor into componentDidUpdate

  UNSAFE_componentWillReceiveProps(nextProps: QuestionProps) {
    const { currentQuestion, previewMode } = this.props;
    if (nextProps.currentQuestion && nextProps.currentQuestion.attempts && nextProps.currentQuestion.attempts.length > 0) {
      this.setState({ questionStatus: this.getCurrentQuestionStatus(nextProps.currentQuestion) })
    }
    if (nextProps.currentQuestion.uid && currentQuestion.uid !== nextProps.currentQuestion.uid) {
      responseActions.getGradedResponsesWithCallback(
        nextProps.currentQuestion.uid,
        (data: Response[]) => {
          this.setState({ responses: data, });
        }
      );
      // previewQuestion has been switched, reset values or set text to latest attempt
      if(previewMode) {
        const latestAttempt = this.handleGetLatestAttempt(nextProps.currentQuestion.attempts)
        if(latestAttempt && latestAttempt.text) {
          this.setState({ response: latestAttempt.text });
        } else {
          this.setState({ response: '' });
        }
        this.setState({ questionStatus: this.getCurrentQuestionStatus(nextProps.currentQuestion) });
      }
    }
  }

  getPreviewQuestionKeys = () => {
    const { activity, questionSet } = this.props;
    let questionKeys;
    if(activity.questions && activity.questions.length) {
      questionKeys = activity.questions.map(question => question.key);
    } else {
      questionKeys = questionSet.map(question => question.uid);
    }
    return questionKeys;
  }

  getPreviewQuestionIndex = (question, questions) => {
    return questions.indexOf(question.uid ? question.uid : question.key);
  }

  previousResponses = () => {
    const question = this.currentQuestion()
    return question.attempts ? question.attempts.map(a => a.text) : []
  }

  getCurrentQuestionStatus(currentQuestion) {
    if (currentQuestion.attempts && currentQuestion.attempts.length) {
      if (currentQuestion.attempts.length === ALLOWED_ATTEMPTS && currentQuestion.attempts[currentQuestion.attempts.length - 1]) {
        if (currentQuestion.attempts[currentQuestion.attempts.length - 1].optimal) {
          return CORRECTLY_ANSWERED
        } else {
          return FINAL_ATTEMPT
        }
      } else {
        if (currentQuestion.attempts.length < ALLOWED_ATTEMPTS && currentQuestion.attempts[currentQuestion.attempts.length - 1] && currentQuestion.attempts[currentQuestion.attempts.length - 1].optimal) {
          return CORRECTLY_ANSWERED
        } else {
          return INCORRECTLY_ANSWERED
        }
      }
    } else {
      return UNANSWERED
    }
  }

  currentQuestion = () => {
    const { currentQuestion } = this.props
    return currentQuestion;
  }

  correctResponse = () => {
    const { responses } = this.state
    const question = this.currentQuestion()
    let text
    if (Object.keys(responses).length) {
      const responseArray = hashToCollection(responses).sort((a: Response, b: Response) => b.count - a.count)
      const correctResponse = responseArray.find((r: Response) => r.optimal)
      if (correctResponse) {
        text = correctResponse.text
      }
    }
    if (!text) {
      text = question.answers[0].text.replace(/{|}/gm, '')
    }
    return text
  }

  handleCheckWorkClick = () => {
    const { checkAnswer } = this.props
    const { response, responses } = this.state
    const question = this.currentQuestion()
    const isFirstAttempt = !question.attempts || question.attempts.length === 0
    if (Object.keys(responses).length) {
      if (response !== '') {
        const trimmedResponse = response.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ')
        if (!isFirstAttempt && response === question.attempts[0].text) {
          this.setState({ submittedSameResponseTwice: true })
        } else {
          checkAnswer(trimmedResponse, question, responses, isFirstAttempt)
          this.setState({ submittedEmptyString: false, submittedSameResponseTwice: false })
        }
      } else {
        this.setState({ submittedEmptyString: true })
      }
    }
  }

  handleNextProblemClick = () => {
    const { dispatch, goToNextQuestion, previewMode, unansweredQuestions, handleToggleQuestion } = this.props;
    if(previewMode) {
      const nextQuestion = unansweredQuestions[0];
      const action = setCurrentQuestion(nextQuestion);
      dispatch(action);
      handleToggleQuestion(nextQuestion);
    } else {
      goToNextQuestion();
      this.setState({ response: '', questionStatus: UNANSWERED, responses: {} })
    }
    const element = document.getElementById("main-content")
    if (!element) { return }
    element.focus()
  }

  handleExampleButtonClick = () => this.setState(prevState => ({ showExample: !prevState.showExample }))

  handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ response: e.target.value })
  }

  getNegativeConceptResultsForResponse(conceptResults: ConceptResult[]) {
    return hashToCollection(conceptResults).filter((cr: ConceptResult) => !cr.correct);
  }

  getNegativeConceptResultForResponse(conceptResults: ConceptResult[]) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  handleGetLatestAttempt(attempts: Response[] = []): Response | undefined {
    return getLatestAttempt(attempts);
  }

  getConcept = () => {
    const { concepts, } = this.props
    return concepts && concepts.data && concepts.data[0] ? concepts.data[0].find((c: any) => c.uid === this.currentQuestion().concept_uid) : null
  }

  handleKeyDown = (e: any) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      const { questionStatus } = this.state
      if (questionStatus === UNANSWERED || questionStatus === INCORRECTLY_ANSWERED) {
        this.handleCheckWorkClick()
      } else {
        this.handleNextProblemClick()
      }
    }
  }

  handleDrop = (e) => e.preventDefault()

  example = (): JSX.Element | string | void => {
    if (this.currentQuestion().rule_description && this.currentQuestion().rule_description.length && this.currentQuestion().rule_description !== "<br/>") {
      return this.currentQuestion().rule_description
    } else if (this.getConcept() && this.getConcept().description) {
      return this.getConcept().description
    }
  }

  renderExample(): JSX.Element | undefined {
    const { showExample, } = this.state
    const example = this.example()
    if (example) {
      let componentClasses = 'example-container flex-start'
      if (showExample) {
        componentClasses += ' show'
      }
      return (
        <div className={componentClasses}>
          <div className="example" dangerouslySetInnerHTML={{ __html: example.replace(/\n/g, "<br />") }} />
        </div>
      );

    } else {
      return undefined
    }
  }

  renderCheckAnswerButton(): JSX.Element | void {
    const { questionStatus, responses, response } = this.state
    const { unansweredQuestions, previewMode } = this.props;
    const buttonClassName = "quill-button primary contained large focus-on-light"

    if (!Object.keys(responses).length) { return }

    if ([CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus)) {
      const buttonText = unansweredQuestions.length === 0 ? 'Next' : 'Next question';
      const disabledStatus = previewMode && buttonText === 'Next' ? 'disabled' : '';
      return <button className={`${buttonClassName} ${disabledStatus}`} disabled={!!disabledStatus} onClick={this.handleNextProblemClick} type="submit">{buttonText}</button>
    }
    if (!response.length || this.previousResponses().includes(response)) {
      return <button className={`${buttonClassName} disabled`} type="submit">Get feedback</button>
    }
    return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">Get feedback</button>
  }

  getQuestionCounts = (): object => {
    const { answeredQuestions, unansweredQuestions, activity, previewMode, questionSet } = this.props;
    let answeredQuestionCount;
    let totalQuestionCount;
    const question = this.currentQuestion();
    if(previewMode) {
      // standard activity questions
      // some Grammar activities return an empty array for the questions property so we check it's length
      if(activity && activity.questions && activity.questions.length) {
        const questions = activity.questions ? activity.questions.map(question => question.key) : [];
        const index = questions && this.getPreviewQuestionIndex(question, questions);
        answeredQuestionCount = index === -1 ? 1 : index + 1;
        totalQuestionCount = questions.length;
      } else if(questionSet) {
        const questions = this.getPreviewQuestionKeys();
        const index = questions.indexOf(question.uid ? question.uid : question.key);
        answeredQuestionCount = index === -1 ? 1 : index + 1;
        totalQuestionCount = questions.length;
      }
    } else {
      answeredQuestionCount = answeredQuestions.length + 1;
      totalQuestionCount = answeredQuestionCount + unansweredQuestions.length;
    }
    return {
      answeredQuestionCount,
      totalQuestionCount
    };
  }

  renderTopSection(): JSX.Element {
    const { activity, isOnMobile, handleTogglePreviewMenu } = this.props;
    const counts = this.getQuestionCounts();
    const meterWidth = counts['answeredQuestionCount'] / counts['totalQuestionCount'] * 100
    const studentSession = getParameterByName('student', window.location.href);
    return (
      <div className="top-section">
        {isOnMobile && !studentSession && <TeacherPreviewMenuButton containerClass="is-on-mobile" handleTogglePreview={handleTogglePreviewMenu} />}
        <ProgressBar
          answeredQuestionCount={counts['answeredQuestionCount']}
          label="questions"
          percent={meterWidth}
          questionCount={counts['totalQuestionCount']}
        />
        <div className="flex-space-between">
          <h1>{activity ? activity.title : null}</h1>
        </div>
        {this.renderExample()}
      </div>
    )
  }

  renderTextareaSection = () => {
    const { questionStatus, response } = this.state;
    const noMoreSubmissionsForStudentSession = [CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus)
    const disabled = noMoreSubmissionsForStudentSession ? 'disabled' : '';

    return (
      <div className="flex-start">
        <ContentEditable
          className={`input-field ${disabled}`}
          data-gramm={false}
          disabled={!!disabled}
          html={response}
          onChange={this.handleResponseChange}
          onDrop={this.handleDrop}
          onKeyDown={this.handleKeyDown}
          placeholder="Type your answer here."
          spellCheck={false}
        />
      </div>
    )
  }

  renderQuestionSection(): JSX.Element {
    const question = this.currentQuestion()
    const { prompt, attempts, cues, cues_label, } = question
    const latestAttempt = this.handleGetLatestAttempt(attempts)
    const feedbackKey = latestAttempt ? latestAttempt.text : 'instructions'
    return (
      <div className="question-section">
        <div className="flex-start">
          <div className="prompt" dangerouslySetInnerHTML={{ __html: prompt }} />
        </div>
        <div className="flex-start">
          <Cues cues={cues} cuesLabel={cues_label} />
        </div>
        <div className="flex-start" key={feedbackKey}>
          {this.renderFeedbackSection()}
        </div>
        {this.renderTextareaSection()}
        <div className="flex-end">
          {this.renderCheckAnswerButton()}
        </div>
        <div className="flex-start">
          {this.renderConceptExplanation()}
        </div>
      </div>
    )
  }

  renderFeedbackSection(): JSX.Element | undefined {
    const { response } = this.state
    const question = this.currentQuestion()
    const latestAttempt: Response | undefined = this.handleGetLatestAttempt(question.attempts)

    if (!latestAttempt) { return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: this.currentQuestion().instructions }} />} feedbackType="instructions" />}

    if (latestAttempt && latestAttempt.optimal) {
      return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: latestAttempt.feedback }} />} feedbackType="correct-matched" />
    }

    if (question.attempts && question.attempts.length === ALLOWED_ATTEMPTS) {
      const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${response}<br><br><b>A strong response</b><br>${this.correctResponse()}`
      return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />} feedbackType="incorrect-continue" />
    }
    return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: latestAttempt && latestAttempt.feedback ? latestAttempt.feedback : '' }} />} feedbackType="revise-matched" />
  }

  renderConceptExplanation = (): JSX.Element | void => {
    const { conceptsFeedback, } = this.props
    const latestAttempt: Response | undefined = this.handleGetLatestAttempt(this.currentQuestion().attempts);
    if (latestAttempt && !latestAttempt.optimal) {
      if (latestAttempt.conceptResults) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.conceptResults);
        if (conceptID) {
          const data = conceptsFeedback.data[conceptID.conceptUID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
        // pretty sure it is only conceptResults now, but trying to avoid further issues
      } else if (latestAttempt.concept_results) {
        const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.concept_results);
        if (conceptID) {
          const data = conceptsFeedback.data[conceptID.conceptUID];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }

      } else if (this.currentQuestion() && this.currentQuestion().modelConceptUID) {
        const dataF = conceptsFeedback.data[this.currentQuestion().modelConceptUID];
        if (dataF) {
          return <ConceptExplanation {...dataF} />;
        }
      } else if (this.currentQuestion().concept_uid) {
        const data = conceptsFeedback.data[this.currentQuestion().concept_uid];
        if (data) {
          return <ConceptExplanation {...data} />;
        }
      }
    }
  }

  render(): JSX.Element {
    return (
      <div className="question">
        {this.renderTopSection()}
        {this.renderQuestionSection()}
      </div>
    )
  }
}

export default QuestionComponent;
