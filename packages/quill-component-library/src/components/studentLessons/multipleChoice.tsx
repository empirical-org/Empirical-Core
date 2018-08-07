import React from 'react';
import _ from 'lodash';
import { Feedback } from '../renderForQuestions/feedback';

class MultipleChoice extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      selected: undefined
    }

    this.selectAnswer = this.selectAnswer.bind(this)
    this.getSelectedAnswer = this.getSelectedAnswer.bind(this)
    this.next = this.next.bind(this)
    this.buttonClasses = this.buttonClasses.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.renderContinueButton = this.renderContinueButton.bind(this)
  }

  selectAnswer(key) {
    if (!this.state.selected) {
      this.setState({ selected: key, },
        () => {
          setTimeout(() => {
            this.next();
          }, 1000);
        });
      }
    }

    getSelectedAnswer() {
      return _.find(this.props.answers, answer => answer.key === this.state.selected);
    }

    next() {
      this.props.next();
    }

    buttonClasses(answer) {
      if (!this.state.selected) {
        return ' is-outlined';
      }

      if (this.state.selected === answer.key) {
        if (answer.optimal) {
          return ' correctly-selected';
        }
        return ' incorrectly-selected';
      }
      return ' ';
    }

    renderOptions() {
      const components = this.props.answers.map(answer => (
        <li key={answer.key}>
          <a
            className={`button lesson-multiple-choice-button${this.buttonClasses(answer)}`}
            onClick={this.selectAnswer.bind(null, answer.key)}
            >
              {answer.text}
            </a>
          </li>
        ));
        return (
          <ul className="lesson-multiple-choice">
          {components}
          </ul>
        );
      }

      renderContinueButton() {
        if (this.state.selected) {
          const buttonClass = this.getSelectedAnswer().optimal ? ' is-primary' : ' is-warning';
          return (
            <h4 className="title is-5">
            <button className={`button is-large${buttonClass}`} onClick={this.next}>Continue </button>
            </h4>
          );
        }
      }

      render() {
        return (
          <section className="student-container">
          <div className="content multiple-choice-content">
          {this.props.prompt}
          <Feedback
          key="multiple-choice"
          feedbackType="override"
          feedback={(<p>Select a strong answer. There may be more than one.</p>)}
          />
          {this.renderOptions()}
          </div>
          </section>
        );
      }

}

export { MultipleChoice }
