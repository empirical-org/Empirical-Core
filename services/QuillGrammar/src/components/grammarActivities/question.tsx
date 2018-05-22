import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import { Row, Button } from "antd";

class Question extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
          showExample: true,
          response: '',
          questionStatus: 'unanswered'
        }

        this.toggleExample = this.toggleExample.bind(this)
        this.updateResponse = this.updateResponse.bind(this)
        this.checkAnswer = this.checkAnswer.bind(this)
        this.goToNextQuestion = this.goToNextQuestion.bind(this)
    }

    currentQuestion() {
      return this.props.currentQuestion
    }

    checkAnswer() {
      const response = this.state.response
      // this.props.submitResponse(response)
      this.props.checkAnswer(response)
      // this.currentQuestion().answers.map(answer => {
      //   const strippedCorrectAnswer = answer.text.replace(/{|}/gm, '')
      //   if (this.state.response === strippedCorrectAnswer) {
      //     this.setState({questionStatus: 'correctly answered', feedback: "<b>Well done!</b> That's the correct answer."})
      //   } else if (this.state.questionStatus === 'incorrectly answered') {
      //     this.setState({questionStatus: 'final attempt', feedback: `<b>Your Response:</b> ${this.state.response} <br/> <b>Correct Response:</b> ${strippedCorrectAnswer}`})
      //   } else {
      //     this.setState({questionStatus: 'incorrectly answered', feedback: '<b>Try again!</b> Unfortunately, that answer is incorrect.'})
      //   }
      // })
    }

    goToNextQuestion() {
      this.props.goToNextQuestion()
      this.setState({response: '', feedback: undefined, questionStatus: 'unanswered'})
    }

    toggleExample() {
      this.setState({showExample: !this.state.showExample})
    }

    updateResponse(e) {
      this.setState({response: e.target.value})
    }

    renderExample(): JSX.Element|undefined {
      const example = this.currentQuestion().rule_description
      if (this.state.showExample && example) {
        return <Row type="flex" align="middle" justify="start">
          <div className="example" dangerouslySetInnerHTML={{__html: example.replace(/\n/g,"<br />")}} />
        </Row>
      }
    }

    renderCheckAnswerButton(): JSX.Element {
      const { response, questionStatus } = this.state
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
      if (this.state.feedback) {
        let className
        switch(this.state.questionStatus) {
          case 'correctly answered':
            className = 'correct'
            break;
          case 'incorrectly answered':
            className = 'try-again'
            break;
          case 'final attempt':
          default:
            className = 'incorrect'
            break;
        }
        return <div className={`feedback ${className}`}><div dangerouslySetInnerHTML={{__html: this.state.feedback}}/></div>
      }
    }

    render(): JSX.Element {
      return <div className="question">
        {this.renderTopSection()}
        {this.renderQuestionSection()}
        {this.renderFeedbackSection()}
      </div>
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapDispatchToProps)(Question);
