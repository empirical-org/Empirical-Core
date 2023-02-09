import React from 'react';

export default class QuestionAndAnswer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  answer() {
    const { expanded } = this.state;
    const { qa } = this.props;
    const { answer } = qa;
    if (expanded) {
      return <div className="answer">{answer}</div>
    }
  }

  expandOrCollapseButton() {
    const { questionsAndAnswersFile } = this.props
    const { expanded } = this.state
    const files = [ 'premium', 'preap', 'ap', 'springboard'];
    const buttonClass = questionsAndAnswersFile === 'lessons' ? 'focus-on-dark' : 'focus-on-light';
    let innerElement;

    if (files.includes(questionsAndAnswersFile)) {
      const imageLink = expanded ? 'collapse.svg' : 'expand.svg'
      innerElement = <img alt="expand-and-collapse" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/${imageLink}`} />
    } else {
      innerElement = expanded ? <p>Collapse</p> : <p>Expand</p>
    }
    return <button className={`expand-collapse-button ${buttonClass}`} onClick={this.handleToggleExpansion} onKeyPress={this.handleKeyPress} type="button">{innerElement}</button>
  }

  handleKeyPress = (e) => {
    e.preventDefault();
    const { key } = e;
    if(key === 'Enter') {
      this.handleToggleExpansion();
    }
  }

  handleToggleExpansion = () => {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  };

  render() {
    const { qa } = this.props;
    const { question } = qa;
    return (
      <div className="qa-section">
        <div className="qa">
          <button className="question" onClick={this.handleToggleExpansion} tabIndex={-1} type="button">{question}</button>
          {this.answer()}
        </div>
        <div>
          {this.expandOrCollapseButton()}
        </div>
      </div>
    )
  }
}
