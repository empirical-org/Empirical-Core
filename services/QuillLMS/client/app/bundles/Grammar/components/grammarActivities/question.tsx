import { ConceptResult, Response } from '../../../Shared/quill-marking-logic/src/main';
import * as React from "react";
import ContentEditable from 'react-contenteditable';

import Cues from './cues';

import { getParameterByName } from '../../../Connect/libs/getParameterByName';
import {
  ConceptExplanation,
  Feedback,
  ProgressBar,
  TeacherPreviewMenuButton,
  getLatestAttempt,
  hashToCollection,
  FinalAttemptFeedback,
  ALLOWED_ATTEMPTS,
  ENGLISH,
  INSTRUCTIONS,
  CORRECT_MATCHED,
  REVISE_MATCHED,
  renderExplanation
} from '../../../Shared/index';
import * as responseActions from '../../actions/responses';
import { setCurrentQuestion } from '../../actions/session';
import { GrammarActivity } from '../../interfaces/grammarActivities';
import { Question } from '../../interfaces/questions';

const UNANSWERED = 'unanswered'
const CORRECTLY_ANSWERED = 'correctly answered'
const FINAL_ATTEMPT = 'final attempt'
const INCORRECTLY_ANSWERED = 'incorrectly answered'

interface QuestionProps {
  activity: GrammarActivity | null;
  answeredQuestions: Question[] | never;
  availableLanguages?: string[];
  dispatch: Function;
  unansweredQuestions: Question[] | never;
  question: Question;
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
  language?: string;
  translate: (language: string) => string;
  showTranslation: boolean;
  translatedQuestions?: any;
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
      questionStatus: this.getCurrentQuestionStatus(props.question),
      submittedEmptyString: false,
      submittedForPreview: false,
      submittedSameResponseTwice: false,
      responses: {},
      previewAttempt: null
    }
  }

  componentDidMount() {
    const { question, } = this.props;
    // preview questions use key as the unique identifier
    const uid = question.uid ? question.uid : question.key;

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
    const { question, previewMode } = this.props;
    const { questionStatus } = this.state;
    const newQuestionStatus = this.getCurrentQuestionStatus(nextProps.question)
    if (nextProps.question && nextProps.question.attempts && nextProps.question.attempts.length > 0 && questionStatus !== newQuestionStatus) {
      this.setState({ questionStatus: newQuestionStatus })
    }
    if (nextProps.question.uid && question.uid !== nextProps.question.uid) {
      responseActions.getGradedResponsesWithCallback(
        nextProps.question.uid,
        (data: Response[]) => {
          this.setState({ responses: data, });
        }
      );
      // previewQuestion has been switched, reset values or set text to latest attempt
      if(previewMode) {
        const latestAttempt = this.handleGetLatestAttempt(nextProps.question.attempts)
        if(latestAttempt && latestAttempt.text) {
          this.setState({ response: latestAttempt.text });
        } else {
          this.setState({ response: '' });
        }
        this.setState({ questionStatus: this.getCurrentQuestionStatus(nextProps.question) });
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
    const { question } = this.props
    return question.attempts ? question.attempts.map(a => a.text) : []
  }

  getCurrentQuestionStatus(question) {
    if (question.attempts && question.attempts.length) {
      if (question.attempts.length === ALLOWED_ATTEMPTS && question.attempts[question.attempts.length - 1]) {
        if (question.attempts[question.attempts.length - 1].optimal) {
          return CORRECTLY_ANSWERED
        } else {
          return FINAL_ATTEMPT
        }
      } else {
        if (question.attempts.length < ALLOWED_ATTEMPTS && question.attempts[question.attempts.length - 1] && question.attempts[question.attempts.length - 1].optimal) {
          return CORRECTLY_ANSWERED
        } else {
          return INCORRECTLY_ANSWERED
        }
      }
    } else {
      return UNANSWERED
    }
  }

  correctResponse = () => {
    const { responses } = this.state
    const { question } = this.props
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
    const { checkAnswer, question } = this.props
    const { response, responses } = this.state
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
    const { concepts, question } = this.props
    return concepts && concepts.data && concepts.data[0] ? concepts.data[0].find((c: any) => c.uid === question.concept_uid) : null
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
    const { question } = this.props
    if (question.rule_description && question.rule_description.length && question.rule_description !== "<br/>") {
      return question.rule_description
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
    const { unansweredQuestions, previewMode, language, availableLanguages, translate } = this.props;
    let showTranslatedButtonText = false
    let defaultButtonText = 'Get feedback'
    if (language && language !== ENGLISH && availableLanguages?.includes(language)) {
      showTranslatedButtonText = true
      defaultButtonText = translate(`buttons^${defaultButtonText.toLowerCase()}`)
    }
    const buttonClassName = "quill-button-archived primary contained large focus-on-light"

    if (!Object.keys(responses).length) { return }

    if ([CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus)) {
      let buttonText = unansweredQuestions.length === 0 ? 'Next' : 'Next question';
      if(showTranslatedButtonText) {
        buttonText = translate(`buttons^${buttonText.toLowerCase()}`)
      }
      const disabledStatus = previewMode && buttonText === 'Next' ? 'disabled' : '';
      return <button className={`${buttonClassName} ${disabledStatus}`} disabled={!!disabledStatus} onClick={this.handleNextProblemClick} type="submit">{buttonText}</button>
    }
    if (!response.length || this.previousResponses().includes(response)) {
      return <button className={`${buttonClassName} disabled`} type="submit">{defaultButtonText}</button>
    }
    return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">{defaultButtonText}</button>
  }

  getQuestionCounts = (): object => {
    const { answeredQuestions, unansweredQuestions, activity, previewMode, questionSet, question } = this.props;
    let answeredQuestionCount;
    let totalQuestionCount;
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
    const { question } = this.props
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
    const { showTranslation, translate, question } = this.props
    const latestAttempt: Response | undefined = this.handleGetLatestAttempt(question.attempts)
    // this is how Connect latestAttempts are structured so we need to match for this shared Feedback component
    const attemptToPass = { response: latestAttempt }
    if (!latestAttempt) {
      return(
        <Feedback
          feedback={<p dangerouslySetInnerHTML={{ __html: question.instructions }} />}
          feedbackType={INSTRUCTIONS}
          question={question}
          showTranslation={showTranslation}
        />
      )
    }
    if (latestAttempt && latestAttempt.optimal) {
      return(
        <Feedback
          feedback={<p dangerouslySetInnerHTML={{ __html: latestAttempt.feedback }} />}
          feedbackType={CORRECT_MATCHED}
          latestAttempt={attemptToPass}
          question={question}
          showTranslation={showTranslation}
        />
      )
    }
    if (question.attempts && question.attempts.length === ALLOWED_ATTEMPTS) {
      return(
        <FinalAttemptFeedback
          correctResponse={this.correctResponse()}
          latestAttempt={latestAttempt?.text}
          showTranslation={showTranslation}
          translate={translate}
        />
      )
    }
    return(
      <Feedback
        feedback={<p dangerouslySetInnerHTML={{ __html: latestAttempt?.feedback ? latestAttempt.feedback : '' }} />}
        feedbackType={REVISE_MATCHED}
        latestAttempt={attemptToPass}
        question={question}
        showTranslation={showTranslation}
        translate={translate}
      />
    )
  }


  renderConceptExplanation = (): JSX.Element | void => {
    const { conceptsFeedback, question, showTranslation } = this.props
    const latestAttempt: Response | undefined = this.handleGetLatestAttempt(question.attempts);
    if(!latestAttempt || latestAttempt.optimal) { return }
    if (latestAttempt.conceptResults) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.conceptResults);
      if (conceptID) {
        const key = conceptID.conceptUID
        const data = conceptsFeedback.data[key];
        return renderExplanation({ data, key, conceptsFeedback, showTranslation })
      }
      // pretty sure it is only conceptResults now, but trying to avoid further issues
    } else if (latestAttempt.concept_results) {
      const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.concept_results);
      if (conceptID) {
        const key = conceptID.conceptUID
        const data = conceptsFeedback.data[key];
        return renderExplanation({ data, key, conceptsFeedback, showTranslation })
      }

    } else if (question && question.modelConceptUID) {
      const key = question.modelConceptUID
      const data = conceptsFeedback.data[key];
      return renderExplanation({ data, key, conceptsFeedback, showTranslation })
    } else if (question.concept_uid) {
      const key = question.concept_uid
      const data = conceptsFeedback.data[key];
      return renderExplanation({ data, key, conceptsFeedback, showTranslation })
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
