import * as React from "react";
import * as Redux from "redux";
import { Row, Button } from "antd";
import { Response, ConceptResult } from 'quill-marking-logic'
import { hashToCollection, ConceptExplanation } from 'quill-component-library/dist/componentLibrary'
import { Question } from '../../interfaces/questions'
import { GrammarActivity } from '../../interfaces/grammarActivities'
import * as responseActions from '../../actions/responses'

interface QuestionProps {
  activity: GrammarActivity|null;
  answeredQuestions: Question[]|never;
  unansweredQuestions: Question[]|never;
  currentQuestion: Question;
  goToNextQuestion: Function;
  checkAnswer: Function;
  conceptsFeedback: any;
}

interface QuestionState {
  showExample: boolean;
  response: string;
  questionStatus: string;
  submittedEmptyString: boolean
  responses: Array<Response>
}

export class QuestionComponent extends React.Component<QuestionProps, QuestionState> {
    constructor(props: QuestionProps) {
        super(props);

        this.state = {
          showExample: true,
          response: '',
          questionStatus: 'unanswered',
          submittedEmptyString: false,
          responses: []
        }

        this.toggleExample = this.toggleExample.bind(this)
        this.updateResponse = this.updateResponse.bind(this)
        this.checkAnswer = this.checkAnswer.bind(this)
        this.goToNextQuestion = this.goToNextQuestion.bind(this)
    }

    componentDidMount() {
      responseActions.getGradedResponsesWithCallback(
        this.props.currentQuestion.uid,
        (data) => {
          this.setState({ responses: data, });
        }
      );
    }

    componentWillReceiveProps(nextProps: QuestionProps) {
      const currentQuestion = nextProps.currentQuestion
      if (currentQuestion && currentQuestion.attempts && currentQuestion.attempts.length > 0) {
        if (currentQuestion.attempts[1]) {
          if (currentQuestion.attempts[1].optimal) {
            this.setState({questionStatus: 'correctly answered'})
          } else {
            this.setState({questionStatus: 'final attempt'})
          }
        } else {
          if (currentQuestion.attempts[0] && currentQuestion.attempts[0].optimal) {
            this.setState({questionStatus: 'correctly answered'})
          } else {
            this.setState({questionStatus: 'incorrectly answered'})
          }
        }
      }
      if (this.props.currentQuestion.uid !== nextProps.currentQuestion.uid) {
        responseActions.getGradedResponsesWithCallback(
          nextProps.currentQuestion.uid,
          (data) => {
            this.setState({ responses: data, });
          }
        );
      }
    }

    currentQuestion() {
      return this.props.currentQuestion
    }

    checkAnswer() {
      const response = this.state.response
      const question = this.currentQuestion()
      const isFirstAttempt = !question.attempts || question.attempts.length === 0
      if (this.state.response !== '') {
        this.props.checkAnswer(response, question, this.state.responses, isFirstAttempt)
        this.setState({submittedEmptyString: false})
      } else {
        this.setState({submittedEmptyString: true})
      }
    }

    goToNextQuestion() {
      this.props.goToNextQuestion()
      this.setState({response: '', questionStatus: 'unanswered'})
    }

    toggleExample() {
      this.setState({ showExample: !this.state.showExample })
    }

    updateResponse(e) {
      this.setState({response: e.target.value})
    }

    getNegativeConceptResultsForResponse(conceptResults: Array<ConceptResult>) {
      return hashToCollection(conceptResults).filter((cr: ConceptResult) => !cr.correct);
    }

    getNegativeConceptResultForResponse(conceptResults: Array<ConceptResult>) {
      const negCRs = this.getNegativeConceptResultsForResponse(conceptResults);
      return negCRs.length > 0 ? negCRs[0] : undefined;
    }

    getLatestAttempt(attempts:Array<Response> = []):Response|undefined {
      const lastIndex = attempts.length - 1;
      return attempts[lastIndex];
    }

    renderExample(): JSX.Element|undefined {
      const example = this.currentQuestion().rule_description
      if (example) {
        let componentClasses = 'example-container'
        if (this.state.showExample) {
          componentClasses += ' show'
        }
        return <Row className={componentClasses} type="flex" align="middle" justify="start">
          <div className="example" dangerouslySetInnerHTML={{__html: example.replace(/\n/g,"<br />")}} />
        </Row>

      } else {
        return undefined
      }
    }

    renderCheckAnswerButton(): JSX.Element {
      const { questionStatus } = this.state
      if (questionStatus === 'unanswered') {
        return <Button className="check-answer-button" onClick={this.checkAnswer}>Check Work</Button>
      } else if (questionStatus === 'incorrectly answered') {
        return <Button className="check-answer-button" onClick={this.checkAnswer}>Recheck Work</Button>
      } else {
        return <Button className="check-answer-button" onClick={this.goToNextQuestion}>Next Problem</Button>
      }
    }

    renderTopSection(): JSX.Element {
      const answeredQuestionCount = this.props.answeredQuestions.length
      const totalQuestionCount = answeredQuestionCount + this.props.unansweredQuestions.length + 1
      const meterWidth = answeredQuestionCount/totalQuestionCount * 100
      return <div className="top-section">
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          >
          <h1>{this.props.activity.title}</h1>
          <div>
            <p>Sentences Completed: {answeredQuestionCount} of {totalQuestionCount}</p>
            <div className="progress-bar-indication">
              <span className="meter"
              style={{width: `${meterWidth}%`}}
            />
            </div>
        </div>
      </Row>
      <Row type="flex" align="middle" justify="start">
        <Button className="example-button" onClick={this.toggleExample}>{this.state.showExample ? 'Hide Example' : 'Show Example'}</Button>
      </Row>
      {this.renderExample()}
      <Row type="flex" align="middle" justify="start">
        <div className="instructions" dangerouslySetInnerHTML={{__html: this.currentQuestion().instructions}} />
      </Row>
      </div>
    }

    renderQuestionSection(): JSX.Element {
      const prompt = this.currentQuestion().prompt
      return <div className="question-section">
        <Row type="flex" align="middle" justify="start">
          <div className="prompt" dangerouslySetInnerHTML={{__html: prompt}} />
        </Row>
        <Row type="flex" align="middle" justify="start">
          <textarea value={this.state.response} className="input-field" onChange={this.updateResponse}/>
        </Row>
        <Row type="flex" align="middle" justify="end">
          {this.renderCheckAnswerButton()}
        </Row>
      </div>
    }

    renderFeedbackSection(): JSX.Element|undefined {
      const question = this.currentQuestion()
      if (question && question.attempts && question.attempts.length > 0) {
        let className: string, feedback: string|undefined|null
        if (question.attempts[1]) {
          if (question.attempts[1].optimal) {
            feedback = question.attempts[1].feedback
            className = 'correct'
          } else {
            feedback = `<b>Your Response:</b> ${this.state.response} <br/> <b>Correct Response:</b> ${question.answers[0].text.replace(/{|}/gm, '')}`
            className = 'incorrect'
          }
        } else {
          if (question.attempts[0].optimal) {
            feedback = question.attempts[0].feedback
            className = 'correct'
          } else {
            feedback = question.attempts[0].feedback
            className = 'try-again'
          }
        }
        return <div className={`feedback ${className}`}><div dangerouslySetInnerHTML={{__html: feedback}}/></div>
      } else if (this.state.submittedEmptyString) {
        return <div className={`feedback try-again`}><div dangerouslySetInnerHTML={{__html: 'You must enter a sentence for us to check.'}}/></div>

      }
      return undefined
    }

    renderConceptExplanation(): JSX.Element|void {
      const latestAttempt:Response|undefined = this.getLatestAttempt(this.currentQuestion().attempts);
      if (latestAttempt && !latestAttempt.optimal) {
        if (latestAttempt.concept_results) {
          const conceptID = this.getNegativeConceptResultForResponse(latestAttempt.concept_results);
          if (conceptID) {
            const data = this.props.conceptsFeedback.data[conceptID.conceptUID];
            if (data) {
              return <ConceptExplanation {...data} />;
            }
          }
        } else if (this.currentQuestion() && this.currentQuestion().modelConceptUID) {
          const dataF = this.props.conceptsFeedback.data[this.currentQuestion().modelConceptUID];
          if (dataF) {
            return <ConceptExplanation {...dataF} />;
          }
        } else if (this.currentQuestion().concept_uid) {
          const data = this.props.conceptsFeedback.data[this.currentQuestion().concept_uid];
          if (data) {
            return <ConceptExplanation {...data} />;
          }
        }
      }
    }

    render(): JSX.Element {
      return <div className="question">
        {this.renderTopSection()}
        {this.renderQuestionSection()}
        {this.renderFeedbackSection()}
        {this.renderConceptExplanation()}
      </div>
    }
}

export default QuestionComponent;
