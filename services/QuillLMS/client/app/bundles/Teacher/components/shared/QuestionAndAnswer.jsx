import React from 'react'

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
    let buttonText = ''

    if (questionsAndAnswersFile === 'premium' || 'preap') {
      const imageLink = expanded ? 'collapse.svg' : 'expand.svg'
      buttonText = <button className="expand-collapse-button" type="button"><img alt="expand-and-collapse" src={`${process.env.CDN_URL}/images/shared/${imageLink}`} /></button>
    } else {
      buttonText = expanded ? 'Collapse' : 'Expand'
    }
    return <p className="expand-or-collapse" onClick={this.handleToggleExpansion} onKeyPress={this.handleKeyPress}>{buttonText}</p>
  }

  handleKeyPress = (e) => {
    e.preventDefault();
    const { key } = e;
    if(key === 'Enter') {
      this.setState(prevState => ({ expanded: !prevState.expanded }));
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
          <p className="question" onClick={this.handleToggleExpansion} onKeyPress={this.handleKeyPress}>{question}</p>
          {this.answer()}
        </div>
        {this.expandOrCollapseButton()}
      </div>
    )
  }
}
