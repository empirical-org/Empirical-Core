import * as React from "react";
import ContentEditable from 'react-contenteditable';
import { Row } from "antd";
import { checkGrammarQuestion, Response, ConceptResult } from 'quill-marking-logic'
import { ProgressBar, ConceptExplanation, Feedback } from 'quill-component-library/dist/componentLibrary';
import Cues from './cues'
import { Question } from '../../interfaces/questions'
import { GrammarActivity } from '../../interfaces/grammarActivities'
import * as responseActions from '../../actions/responses'
import { hashToCollection } from '../../../Shared/index'

const ALLOWED_ATTEMPTS = 5
const UNANSWERED = 'unanswered'
const CORRECTLY_ANSWERED = 'correctly answered'
const FINAL_ATTEMPT = 'final attempt'
const INCORRECTLY_ANSWERED = 'incorrectly answered'

interface QuestionProps {
  activity: GrammarActivity | null;
  answeredQuestions: Question[] | never;
  unansweredQuestions: Question[] | never;
  currentQuestion: Question;
  goToNextQuestion: Function;
  checkAnswer: Function;
  conceptsFeedback: any;
  concepts: any;
  previewMode: boolean;
  questionToPreview: Question;
  questions: Question[];
  handleToggleQuestion: (question: Question) => void;
  switchedBackToPreview: boolean;
  randomizedQuestions: any[];
}

interface QuestionState {
  showExample: boolean;
  response: string;
  questionStatus: string;
  submittedEmptyString: boolean;
  submittedForPreview: boolean;
  submittedSameResponseTwice: boolean;
  responses: { [key: number]: Response };
  randomizedQuestions: string[];
  previewSubmissionCount: number;
  previewQuestionCorrect: boolean;
  isLastPreviewQuestion: boolean;
  switchedToPreview: boolean;
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
      randomizedQuestions: props.randomizedQuestions,
      previewSubmissionCount: 0,
      previewQuestionCorrect: false,
      isLastPreviewQuestion: false,
      switchedToPreview: props.switchedBackToPreview,
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
  }

  UNSAFE_componentWillReceiveProps(nextProps: QuestionProps) {
    const { currentQuestion, previewMode } = this.props;
    if (nextProps.currentQuestion && nextProps.currentQuestion.attempts && nextProps.currentQuestion.attempts.length > 0 && !previewMode) {
      this.setState({ questionStatus: this.getCurrentQuestionStatus(nextProps.currentQuestion) })
    }
    if (nextProps.currentQuestion.uid && currentQuestion.uid !== nextProps.currentQuestion.uid) {
      responseActions.getGradedResponsesWithCallback(
        nextProps.currentQuestion.uid,
        (data: Response[]) => {
          this.setState({ responses: data, });
        }
      );
      if(previewMode) {
        // previewQuestion has been switched, reset values
        const questionKeys = this.getPreviewQuestionKeys();
        const index = questionKeys && this.getPreviewQuestionIndex(nextProps.currentQuestion, questionKeys);
        if(questionKeys && index === questionKeys.length - 1) {
          this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: true });
        } else {
          this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: false });
        }
      }
    } else if(nextProps.currentQuestion.key && currentQuestion.key !== nextProps.currentQuestion.key) {
      // previewQuestion has been switched, reset values
      const questionKeys = this.getPreviewQuestionKeys();
      const index = questionKeys && this.getPreviewQuestionIndex(nextProps.currentQuestion, questionKeys);
      if(questionKeys && index === questionKeys.length - 1) {
        this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: true });
      } else {
        this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: false });
      }
      responseActions.getGradedResponsesWithCallback(
        nextProps.currentQuestion.key,
        (data: Response[]) => {
          this.setState({ responses: data, });
        }
      );
    }
  }

  getPreviewQuestionKeys = () => {
    const { activity, randomizedQuestions } = this.props;
    let questionKeys;
    if(activity.questions && activity.questions.length) {
      questionKeys = activity.questions.map(question => question.key);
    } else {
      questionKeys = randomizedQuestions.map(question => question.uid);
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
    const { previewMode } = this.props;
    if (currentQuestion.attempts && currentQuestion.attempts.length && !previewMode) {
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
    const { currentQuestion, questionToPreview } = this.props
    return questionToPreview ? questionToPreview : currentQuestion;
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
    const { checkAnswer, previewMode } = this.props
    const { response, responses } = this.state
    const question = this.currentQuestion()
    const isFirstAttempt = !question.attempts || question.attempts.length === 0
    if (Object.keys(responses).length) {
      if (response !== '') {
        const trimmedResponse = response.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ')
        if (!isFirstAttempt && response === question.attempts[0].text) {
          this.setState({ submittedSameResponseTwice: true })
        } else {
          if(previewMode) {
            const responseObj = this.getPreviewAttempt({ question, response, responses });
            this.setState(prevState => ({ submittedForPreview: true, previewSubmissionCount: prevState.previewSubmissionCount + 1, previewAttempt: responseObj }));
          }
          checkAnswer(trimmedResponse, question, responses, isFirstAttempt)
          this.setState({ submittedEmptyString: false, submittedSameResponseTwice: false })
        }
      } else {
        this.setState({ submittedEmptyString: true })
      }
    }
  }

  handleNextProblemClick = () => {
    const { goToNextQuestion, previewMode, handleToggleQuestion, currentQuestion, questions } = this.props;
    if(previewMode) {
      const questionKeys = this.getPreviewQuestionKeys();
      const index = questionKeys && this.getPreviewQuestionIndex(currentQuestion, questionKeys) + 1;
      if(index === questionKeys.length - 1) {
        const key = questionKeys[index];
        const question = questions[key];
        question.key = key;
        this.setState({ previewQuestionCorrect: false, isLastPreviewQuestion: true, submittedForPreview: false, previewSubmissionCount: 0, response: '', switchedToPreview: false });
        handleToggleQuestion(question);
      } else {
        const key = questionKeys[index === 0 ? 1 : index];
        const question = questions[key];
        question.key = key;
        this.setState({ previewQuestionCorrect: false, submittedForPreview: false, previewSubmissionCount: 0, response: '', switchedToPreview: false });
        handleToggleQuestion(question);
      }
    } else {
      goToNextQuestion()
      this.setState({ response: '', questionStatus: UNANSWERED, responses: {} })
    }
  }

  handleExampleButtonClick = () => this.setState(prevState => ({ showExample: !prevState.showExample }))

  handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { submittedForPreview } = this.state;
    if(submittedForPreview) {
      this.setState({ submittedForPreview: false });
    }
    this.setState({ response: e.target.value })
  }

  getNegativeConceptResultsForResponse(conceptResults: ConceptResult[]) {
    return hashToCollection(conceptResults).filter((cr: ConceptResult) => !cr.correct);
  }

  getNegativeConceptResultForResponse(conceptResults: ConceptResult[]) {
    const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
    return negCRs.length > 0 ? negCRs[0] : undefined;
  }

  getLatestAttempt(attempts: Response[] = []): Response | undefined {
    const { switchedToPreview } = this.state;
    const lastIndex = attempts.length - 1;

    // handle edge case for when teacher goes from preview to regular activity, plays a question and switches back to preview
    if(switchedToPreview) {
      return null;
    } else {
      return attempts[lastIndex];
    }
  }

  getConcept = () => {
    const { concepts, } = this.props
    return concepts && concepts.data && concepts.data[0] ? concepts.data[0].find((c: any) => c.uid === this.currentQuestion().concept_uid) : null
  }

  handleKeyDown = (e: any) => {
    const { previewSubmissionCount, previewQuestionCorrect } = this.state;
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      const { questionStatus } = this.state
      if(previewSubmissionCount === ALLOWED_ATTEMPTS || previewQuestionCorrect) {
        this.handleNextProblemClick();
      } else if (questionStatus === UNANSWERED || questionStatus === INCORRECTLY_ANSWERED) {
        this.handleCheckWorkClick()
      } else {
        this.handleNextProblemClick()
      }
    }
  }

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
      let componentClasses = 'example-container'
      if (showExample) {
        componentClasses += ' show'
      }
      return (
        <Row align="middle" className={componentClasses} justify="start" type="flex">
          <div className="example" dangerouslySetInnerHTML={{ __html: example.replace(/\n/g, "<br />") }} />
        </Row>
      );

    } else {
      return undefined
    }
  }

  getCheckAnswerForPreview = (buttonClassName: string) => {
    const { previewQuestionCorrect, previewSubmissionCount, isLastPreviewQuestion } = this.state;
    // correctly answered or max attempts reached
    if((previewQuestionCorrect || previewSubmissionCount === ALLOWED_ATTEMPTS) && !isLastPreviewQuestion) {
      return <button className={buttonClassName} onClick={this.handleNextProblemClick} type="submit">Next question</button>
    } else if((previewSubmissionCount === ALLOWED_ATTEMPTS || previewQuestionCorrect) && isLastPreviewQuestion) {
      // correctly answered or max attempts reached on last question
      return <button className={`${buttonClassName} disabled`} type="submit">Get feedback</button>
    }
    return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">Get feedback</button>
  }

  getCheckAnswerForStandardPlay = (buttonClassName: string) => {
    const { questionStatus, response } = this.state
    const { unansweredQuestions } = this.props;
    if ([CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus)) {
      const buttonText = unansweredQuestions.length === 0 ? 'Next' : 'Next question'
      return <button className={buttonClassName} onClick={this.handleNextProblemClick} type="submit">{buttonText}</button>
    }
    if (!response.length || this.previousResponses().includes(response)) {
      return <button className={`${buttonClassName} disabled`} type="submit">Get feedback</button>
    }
    return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">Get feedback</button>
  }

  renderCheckAnswerButton(): JSX.Element | void {
    const { responses } = this.state
    const { previewMode } = this.props;
    if (!Object.keys(responses).length && !previewMode) { return }

    const buttonClassName = "quill-button primary contained large focus-on-light"

    if(previewMode) {
      return this.getCheckAnswerForPreview(buttonClassName);
    } else {
      return this.getCheckAnswerForStandardPlay(buttonClassName);
    }
  }

  getQuestionCounts = (): object => {
    const { answeredQuestions, unansweredQuestions, activity, previewMode, randomizedQuestions } = this.props;
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
      } else if(randomizedQuestions) {
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
    const { activity } = this.props;
    const counts = this.getQuestionCounts();
    const meterWidth = counts['answeredQuestionCount'] / counts['totalQuestionCount'] * 100
    return (<div className="top-section">
      <ProgressBar
        answeredQuestionCount={counts['answeredQuestionCount']}
        label="questions"
        percent={meterWidth}
        questionCount={counts['totalQuestionCount']}
      />
      <Row
        align="middle"
        justify="space-between"
        type="flex"
      >
        <h1>{activity ? activity.title : null}</h1>
      </Row>
      {this.renderExample()}
    </div>)
  }

  renderTextareaSection = () => {
    const { questionStatus, response, previewSubmissionCount, previewQuestionCorrect } = this.state;
    const { previewMode } = this.props;
    const question = this.currentQuestion()
    const latestAttempt: Response | undefined = this.getLatestAttempt(question.attempts)
    const maxPreviewQuestionAttempts = previewSubmissionCount === ALLOWED_ATTEMPTS;
    const nonOptimal = (question.attempts && question.attempts.length === ALLOWED_ATTEMPTS) && (latestAttempt && !latestAttempt.optimal);
    const noMoreSubmissionsForStudentSession = [CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus) && !previewMode;
    const noMoreSubmissionsForPreviewSession = maxPreviewQuestionAttempts || previewQuestionCorrect;
    const disabled = noMoreSubmissionsForStudentSession && noMoreSubmissionsForPreviewSession ? 'disabled' : '';

    if(nonOptimal || maxPreviewQuestionAttempts) {
      return
    }

    return (<Row align="middle" justify="start" type="flex">
      <ContentEditable
        className={`input-field ${disabled}`}
        data-gramm={false}
        disabled={!!disabled}
        html={response}
        onChange={this.handleResponseChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Type your answer here."
        spellCheck={false}
      />
    </Row>)
  }

  renderQuestionSection(): JSX.Element {
    const question = this.currentQuestion()
    const { prompt, attempts, cues, cues_label, } = question
    const latestAttempt = this.getLatestAttempt(attempts)
    const feedbackKey = latestAttempt ? latestAttempt.text : 'instructions'
    return (<div className="question-section">
      <Row align="middle" justify="start" type="flex">
        <div className="prompt" dangerouslySetInnerHTML={{ __html: prompt }} />
      </Row>
      <Row align="middle" justify="start" type="flex">
        <Cues cues={cues} cuesLabel={cues_label} />
      </Row>
      <Row align="middle" justify="start" key={feedbackKey} type="flex">
        {this.renderFeedbackSection()}
      </Row>
      {this.renderTextareaSection()}
      <Row align="middle" justify="end" type="flex">
        {this.renderCheckAnswerButton()}
      </Row>
      <Row align="middle" justify="start" type="flex">
        {this.renderConceptExplanation()}
      </Row>
    </div>)
  }

  getPreviewAttempt = ({ question, response, responses }) => {
    const questionUID: string = question.key
    const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a: { order: number }, b: { order: number }) => a.order - b.order) : [];
    const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
    const defaultConceptUID = question.modelConceptUID || question.concept_uid
    const responseObj = checkGrammarQuestion(questionUID, response, responses, focusPoints, incorrectSequences, defaultConceptUID);
    return responseObj;
  }

  renderPreviewFeedbackSection({ response, previewQuestionCorrect, previewSubmissionCount }): JSX.Element | undefined {
    const { previewAttempt } = this.state;
    if (previewAttempt.optimal && !previewQuestionCorrect) {
      this.setState({ previewQuestionCorrect: true });
    }
    if(previewAttempt.optimal && previewQuestionCorrect) {
      return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: previewAttempt.feedback }} />} feedbackType="correct-matched" />
    }
    if(previewSubmissionCount === ALLOWED_ATTEMPTS) {
      const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${response}<br><br><b>A strong response</b><br>${this.correctResponse()}`
      return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />} feedbackType="incorrect-continue" />
    }
    return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: previewAttempt.feedback }} />} feedbackType="revise-matched" />
  }

  renderFeedbackSection(): JSX.Element | undefined {
    const { previewMode } = this.props;
    const { response, previewSubmissionCount, previewQuestionCorrect } = this.state
    const question = this.currentQuestion()
    const latestAttempt: Response | undefined = this.getLatestAttempt(question.attempts)

    if (!latestAttempt && !previewSubmissionCount) { return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: this.currentQuestion().instructions }} />} feedbackType="instructions" />}

    if(previewMode) {
      return this.renderPreviewFeedbackSection({ response, previewQuestionCorrect, previewSubmissionCount });
    }

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
    const latestAttempt: Response | undefined = this.getLatestAttempt(this.currentQuestion().attempts);
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
    return (<div className="question">
      {this.renderTopSection()}
      {this.renderQuestionSection()}
    </div>)
  }
}

export default QuestionComponent;
