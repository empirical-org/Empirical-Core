import * as React from "react";
import ContentEditable from 'react-contenteditable';
import { Row } from "antd";
import { checkGrammarQuestion, Response, ConceptResult } from 'quill-marking-logic'
import { hashToCollection, ProgressBar, ConceptExplanation, Feedback } from 'quill-component-library/dist/componentLibrary';
import Cues from './cues'
import { Question } from '../../interfaces/questions'
import { GrammarActivity } from '../../interfaces/grammarActivities'
import * as responseActions from '../../actions/responses'

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
      randomizedQuestions: null,
      previewSubmissionCount: 0,
      previewQuestionCorrect: false,
      isLastPreviewQuestion: false
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
      if(previewMode) {
        // previewQuestion has been switched, reset values
        const questionKeys = this.getPreviewQuestionKeys(nextProps.activity);
        const index = questionKeys && this.getPreviewQuestionIndex(nextProps.currentQuestion, questionKeys);
        if(questionKeys && index === questionKeys.length - 1) {
          this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: true });
        } else {
          this.setState({ submittedForPreview: false, response: '', previewSubmissionCount: 0, previewQuestionCorrect: false, isLastPreviewQuestion: false });
        }
      }
    } else if(nextProps.currentQuestion.key && currentQuestion.key !== nextProps.currentQuestion.key) {
      // previewQuestion has been switched, reset values
      const questionKeys = this.getPreviewQuestionKeys(nextProps.activity);
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

  getPreviewQuestionKeys = (activity) => {
    const { randomizedQuestions } = this.state;
    let questionKeys; 
    if(activity.questions) {
      questionKeys = activity.questions.map(question => question.key);
    } else {
      questionKeys = randomizedQuestions;
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
            this.setState(prevState => ({ submittedForPreview: true, previewSubmissionCount: prevState.previewSubmissionCount + 1 }));
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
    const { activity, goToNextQuestion, previewMode, handleToggleQuestion, currentQuestion, questions } = this.props;
    if(previewMode) {
      const questionKeys = this.getPreviewQuestionKeys(activity);
      const index = questionKeys && this.getPreviewQuestionIndex(currentQuestion, questionKeys) + 1;
      if(index === questionKeys.length - 1) {
        const question = questions[questionKeys[index]];
        this.setState({ previewQuestionCorrect: false, isLastPreviewQuestion: true });
        handleToggleQuestion(question);
      } else {
        const question = questions[questionKeys[index]];
        this.setState({ previewQuestionCorrect: false });
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
    const lastIndex = attempts.length - 1;
    return attempts[lastIndex];
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

  renderCheckAnswerButton(): JSX.Element | void {
    const { questionStatus, responses, response, previewQuestionCorrect, previewSubmissionCount, isLastPreviewQuestion } = this.state
    const { previewMode, unansweredQuestions } = this.props;
    if (!Object.keys(responses).length && !previewMode) { return }

    const buttonClassName = "quill-button primary contained large focus-on-light"

    if(previewMode) {
      if((previewQuestionCorrect || previewSubmissionCount === ALLOWED_ATTEMPTS) && !isLastPreviewQuestion) {
        return <button className={buttonClassName} onClick={this.handleNextProblemClick} type="submit">Next question</button>
      } else if((previewSubmissionCount === ALLOWED_ATTEMPTS || previewQuestionCorrect) && isLastPreviewQuestion) {
        return <button className={`${buttonClassName} disabled`} type="submit">Get feedback</button>
      }
      return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">Get feedback</button>
    } else {
      if ([CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus)) {
        const buttonText = unansweredQuestions.length === 0 ? 'Next' : 'Next question'
        return <button className={buttonClassName} onClick={this.handleNextProblemClick} type="submit">{buttonText}</button>
      }
      if (!response.length || this.previousResponses().includes(response)) {
        return <button className={`${buttonClassName} disabled`} type="submit">Get feedback</button>
      }
      return <button className={buttonClassName} onClick={this.handleCheckWorkClick} type="submit">Get feedback</button>
    }
  }

  renderTopSection(): JSX.Element {
    const { answeredQuestions, currentQuestion, unansweredQuestions, activity, previewMode } = this.props;
    const { randomizedQuestions } = this.state;
    let answeredQuestionCount;
    let totalQuestionCount;
    const question = this.currentQuestion();
    if(previewMode) {
      // standard activity questions
      if(activity && activity.questions) {
        const questions = activity.questions ? activity.questions.map(question => question.key) : [];
        answeredQuestionCount = questions && this.getPreviewQuestionIndex(question, questions) + 1;
        totalQuestionCount = questions.length;
      } else if(!randomizedQuestions) {
        const questions = [currentQuestion, ...unansweredQuestions].map(question => question.uid);
        this.setState({ randomizedQuestions: questions });
        // randomly selected activity questions
      } else if(randomizedQuestions) {
        answeredQuestionCount = randomizedQuestions.indexOf(question.uid ? question.uid : question.key) + 1;
        totalQuestionCount = randomizedQuestions.length;
      }
    } else {
      answeredQuestionCount = answeredQuestions.length + 1;
      totalQuestionCount = answeredQuestionCount + unansweredQuestions.length;
    }
    const meterWidth = answeredQuestionCount / totalQuestionCount * 100
    return (<div className="top-section">
      <ProgressBar
        answeredQuestionCount={answeredQuestionCount}
        label="questions"
        percent={meterWidth}
        questionCount={totalQuestionCount}
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
    const { questionStatus, response, previewSubmissionCount } = this.state
    const question = this.currentQuestion()
    const latestAttempt: Response | undefined = this.getLatestAttempt(question.attempts)

    if ((question.attempts && question.attempts.length === ALLOWED_ATTEMPTS) && (latestAttempt && !latestAttempt.optimal)) { 
      return 
    } else if(previewSubmissionCount === ALLOWED_ATTEMPTS) {
      return
    }
    const disabled = [CORRECTLY_ANSWERED, FINAL_ATTEMPT].includes(questionStatus) ? 'disabled' : null
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

  renderFeedbackSection(): JSX.Element | undefined {
    const { previewMode } = this.props;
    const { response, responses, submittedForPreview, previewSubmissionCount, previewQuestionCorrect } = this.state
    const question = this.currentQuestion()
    const latestAttempt: Response | undefined = this.getLatestAttempt(question.attempts)

    if (!latestAttempt && !submittedForPreview) { return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: this.currentQuestion().instructions }} />} feedbackType="instructions" />}

    if(previewMode) {
      const questionUID: string = question.key
      const focusPoints = question.focusPoints ? hashToCollection(question.focusPoints).sort((a, b) => a.order - b.order) : [];
      const incorrectSequences = question.incorrectSequences ? hashToCollection(question.incorrectSequences) : [];
      const defaultConceptUID = question.modelConceptUID || question.concept_uid
      const responseObj = checkGrammarQuestion(questionUID, response, responses, focusPoints, incorrectSequences, defaultConceptUID);
      if (responseObj.optimal && !previewQuestionCorrect) {
        this.setState({ previewQuestionCorrect: true });
      }
      if(responseObj.optimal && previewQuestionCorrect) {
        return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: responseObj.feedback }} />} feedbackType="correct-matched" />
      }
      if(previewSubmissionCount === ALLOWED_ATTEMPTS) {
        const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${response}<br><br><b>A strong response</b><br>${this.correctResponse()}`
        return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />} feedbackType="incorrect-continue" />
      }
      return <Feedback feedback={<p dangerouslySetInnerHTML={{ __html: responseObj.feedback }} />} feedbackType="revise-matched" />
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
