import React from 'react'

export default class QuestionAndAnswer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  answer() {
    if (this.state.expanded) {
      return <div className="answer">{this.props.qa.answer}</div>
    }
  }

  expandOrCollapseButton() {
    const { questionsAndAnswersFile } = this.props
    const { expanded } = this.state
    let buttonText = ''

    if (questionsAndAnswersFile == 'premium') {
      const imageLink = expanded ? 'collapse.svg' : 'expand.svg'
      buttonText = <button className="expand-collapse-button" type="button"><img alt="expand-and-collapse" src={`${process.env.CDN_URL}/images/shared/${imageLink}`} /></button>
    } else {
      buttonText = expanded ? 'Collapse' : 'Expand'
    }
    return <p className="expand-or-collapse" onClick={this.toggleExpansion}>{buttonText}</p>
  }

  toggleExpansion = () => {
    this.setState({expanded: !this.state.expanded})
  };

  render() {
    return (
      <div className="qa-section">
        <div className="qa">
          <p className="question" onClick={this.toggleExpansion}>{this.props.qa.question}</p>
          {this.answer()}
        </div>
        {this.expandOrCollapseButton()}
      </div>
    )
  }
}
