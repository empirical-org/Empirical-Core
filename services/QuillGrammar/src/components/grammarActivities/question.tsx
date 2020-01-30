import * as React from "react";
import { Row, Button } from "antd";
import { Response, ConceptResult } from 'quill-marking-logic'
import { hashToCollection, ConceptExplanation } from 'quill-component-library/dist/componentLibrary'
import { Question } from '../../interfaces/questions'
import { GrammarActivity } from '../../interfaces/grammarActivities'
import * as responseActions from '../../actions/responses'
import ProgressBar from './progressBar'

const tryAgainIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/try_again_icon.png`
const incorrectIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/incorrect_icon.png`
const correctIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/correct_icon.png`
const questionIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/question_icon.svg`

interface QuestionProps {
  activity: GrammarActivity|null;
  answeredQuestions: Question[]|never;
  unansweredQuestions: Question[]|never;
  currentQuestion: Question;
  goToNextQuestion: Function;
  checkAnswer: Function;
  conceptsFeedback: any;
  concepts: any;
}

interface QuestionState {
  showExample: boolean;
  response: string;
  questionStatus: string;
  submittedEmptyString: boolean
  submittedSameResponseTwice: boolean
  responses: {[key:number]: Response}
}

export class QuestionComponent extends React.Component<QuestionProps, QuestionState> {
    constructor(props: QuestionProps) {
      super(props);

      this.state = {
        showExample: true,
        response: '',
        questionStatus: this.getCurrentQuestionStatus(props.currentQuestion),
        submittedEmptyString: false,
        submittedSameResponseTwice: false,
        responses: {}
      }
    }

    componentDidMount() {
      const { currentQuestion, } = this.props

      responseActions.getGradedResponsesWithCallback(
        currentQuestion.uid,
        (data) => {
          this.setState({ responses: data, });
        }
      );
    }

    componentWillReceiveProps(nextProps: QuestionProps) {
      const { currentQuestion, } = this.props
      if (nextProps.currentQuestion && nextProps.currentQuestion.attempts && nextProps.currentQuestion.attempts.length > 0) {
        this.setState({ questionStatus: this.getCurrentQuestionStatus(nextProps.currentQuestion) })
      }
      if (currentQuestion.uid !== nextProps.currentQuestion.uid) {
        responseActions.getGradedResponsesWithCallback(
          nextProps.currentQuestion.uid,
          (data: Response[]) => {
            this.setState({ responses: data, });
          }
        );
      }
    }

    getCurrentQuestionStatus(currentQuestion) {
      if (currentQuestion.attempts && currentQuestion.attempts.length) {
        if (currentQuestion.attempts[1]) {
          if (currentQuestion.attempts[1].optimal) {
            return 'correctly answered'
          } else {
            return 'final attempt'
          }
        } else {
          if (currentQuestion.attempts[0] && currentQuestion.attempts[0].optimal) {
            return 'correctly answered'
          } else {
            return 'incorrectly answered'
          }
        }
      } else {
        return 'unanswered'
      }
    }

    currentQuestion = () => {
      const { currentQuestion, } = this.props
      return currentQuestion
    }

    correctResponse = () => {
      const { responses} = this.state
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
      const { checkAnswer, } = this.props
      const { response, responses } = this.state
      const question = this.currentQuestion()
      const isFirstAttempt = !question.attempts || question.attempts.length === 0
      if (Object.keys(responses).length) {
        if (response !== '') {
          if (!isFirstAttempt && response === question.attempts[0].text) {
            this.setState({ submittedSameResponseTwice: true})
          } else {
            checkAnswer(response, question, responses, isFirstAttempt)
            this.setState({submittedEmptyString: false, submittedSameResponseTwice: false})
          }
        } else {
          this.setState({submittedEmptyString: true})
        }
      }
    }

    handleNextProblemClick = () => {
      const { goToNextQuestion, } = this.props
      goToNextQuestion()
      this.setState({response: '', questionStatus: 'unanswered', responses: {}})
    }

    handleExampleButtonClick = () => this.setState(prevState => ({ showExample: !prevState.showExample }))

    handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.setState({response: e.target.value})
    }

    getNegativeConceptResultsForResponse(conceptResults: ConceptResult[]) {
      return hashToCollection(conceptResults).filter((cr: ConceptResult) => !cr.correct);
    }

    getNegativeConceptResultForResponse(conceptResults: ConceptResult[]) {
      const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
      return negCRs.length > 0 ? negCRs[0] : undefined;
    }

    getLatestAttempt(attempts: Response[] = []): Response|undefined {
      const lastIndex = attempts.length - 1;
      return attempts[lastIndex];
    }

    getConcept = () => {
      const { concepts, } = this.props
      return concepts && concepts.data && concepts.data[0] ? concepts.data[0].find((c: any) => c.uid === this.currentQuestion().concept_uid) : null
    }

    handleKeyDown = (e: any) => {
      if(e.keyCode == 13 && e.shiftKey == false) {
        e.preventDefault();
        const { questionStatus } = this.state
        if (questionStatus === 'unanswered' || questionStatus === 'incorrectly answered') {
          this.handleCheckWorkClick()
        } else {
          this.handleNextProblemClick()
        }
      }
    }

    example = (): JSX.Element|string|void => {
      if (this.currentQuestion().rule_description && this.currentQuestion().rule_description.length && this.currentQuestion().rule_description !== "<br/>") {
        return this.currentQuestion().rule_description
      } else if (this.getConcept() && this.getConcept().description) {
        return this.getConcept().description
      }
    }

    renderExample(): JSX.Element|undefined {
      const { showExample, } = this.state
      const example = this.example()
      if (example) {
        let componentClasses = 'example-container'
        if (showExample) {
          componentClasses += ' show'
        }
        return (<Row align="middle" className={componentClasses} justify="start" type="flex">
          <div className="example" dangerouslySetInnerHTML={{__html: example.replace(/\n/g, "<br />")}} />
        </Row>)

      } else {
        return undefined
      }
    }

    renderExampleButton(): JSX.Element|void {
      const { showExample, } = this.state
      if (this.example()) {
        return (<Row align="middle" justify="start" type="flex">
          <Button className="example-button" onClick={this.handleExampleButtonClick}>{showExample ? 'Hide Example' : 'Show Example'}</Button>
        </Row>)
      }
    }

    renderCheckAnswerButton(): JSX.Element|void {
      const { questionStatus, responses } = this.state
      if (Object.keys(responses).length) {
        if (questionStatus === 'unanswered') {
          return <Button className="check-answer-button" onClick={this.handleCheckWorkClick}>Check Work</Button>
        } else if (questionStatus === 'incorrectly answered') {
          return <Button className="check-answer-button" onClick={this.handleCheckWorkClick}>Recheck Work</Button>
        } else {
          return <Button className="check-answer-button" onClick={this.handleNextProblemClick}>Next Problem</Button>
        }
      }
    }

    renderTopSection(): JSX.Element {
      const { answeredQuestions, unansweredQuestions, activity, } = this.props
      const answeredQuestionCount = answeredQuestions.length
      const totalQuestionCount = answeredQuestionCount + unansweredQuestions.length + 1
      const meterWidth = answeredQuestionCount / totalQuestionCount * 100
      return (<div className="top-section">
        <ProgressBar
          answeredQuestionCount={answeredQuestionCount}
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
        {this.renderExampleButton()}
        {this.renderExample()}
        <Row align="middle" justify="start" type="flex">
          <img src={questionIconSrc} style={{ height: '22px', marginRight: '10px' }} />
          <div className="instructions" dangerouslySetInnerHTML={{__html: this.currentQuestion().instructions}} />
        </Row>
      </div>)
    }

    renderTextareaSection = () => {
      const { questionStatus, response } = this.state
      if (['correctly answered', 'final attempt'].includes(questionStatus)) {
        return (<Row align="middle" justify="start" type="flex">
          <textarea className="input-field disabled" disabled value={response} />
        </Row>)
      } else {
        return (<Row align="middle" justify="start" type="flex">
          <textarea className="input-field" onChange={this.handleResponseChange} onKeyDown={this.handleKeyDown} spellCheck="false" value={response} />
        </Row>)
      }
    }

    renderQuestionSection(): JSX.Element {
      const prompt = this.currentQuestion().prompt
      return (<div className="question-section">
        <Row align="middle" justify="start" type="flex">
          <div className="prompt" dangerouslySetInnerHTML={{__html: prompt}} />
        </Row>
        {this.renderTextareaSection()}
        <Row align="middle" justify="end" type="flex">
          {this.renderCheckAnswerButton()}
        </Row>
      </div>)
    }

    renderFeedbackSection(): JSX.Element|undefined {
      const { submittedEmptyString, submittedSameResponseTwice, response, } = this.state
      const question = this.currentQuestion()
      if (submittedEmptyString) {
        return <div className="feedback try-again"><div className="inner-container"><img src={tryAgainIconSrc} /><div dangerouslySetInnerHTML={{__html: 'You must enter a sentence for us to check.'}} /></div></div>
      } else if (submittedSameResponseTwice) {
        return <div className="feedback try-again"><div className="inner-container"><img src={tryAgainIconSrc} /><div dangerouslySetInnerHTML={{__html: 'You must enter a different response.'}} /></div></div>
      } else if (question && question.attempts && question.attempts.length > 0) {
        let className: string, feedback: string|undefined|null, imgSrc: string
        if (question.attempts[1]) {
          if (question.attempts[1].optimal) {
            feedback = question.attempts[1].feedback
            className = 'correct'
            imgSrc = correctIconSrc
          } else {
            feedback = `<b>Your Response:</b> ${response} <br/> <b>Correct Response:</b> ${this.correctResponse()}`
            className = 'incorrect'
            imgSrc = incorrectIconSrc
          }
        } else {
          if (question.attempts[0].optimal) {
            feedback = question.attempts[0].feedback
            className = 'correct'
            imgSrc = correctIconSrc
          } else {
            feedback = question.attempts[0].feedback
            className = 'try-again'
            imgSrc = tryAgainIconSrc
          }
        }
        if (typeof feedback === 'string') {
          return <div className={`feedback ${className}`}><div className="inner-container"><img src={imgSrc} /><div dangerouslySetInnerHTML={{__html: feedback}} /></div></div>
        }
      }
      return undefined
    }

    renderConceptExplanation = (): JSX.Element|void => {
      const { conceptsFeedback, } = this.props
      const latestAttempt: Response|undefined = this.getLatestAttempt(this.currentQuestion().attempts);
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
        {this.renderFeedbackSection()}
        {this.renderConceptExplanation()}
      </div>)
    }
}

export default QuestionComponent;
