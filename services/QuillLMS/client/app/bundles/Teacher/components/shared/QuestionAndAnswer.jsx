import React from 'react'

export default class QuestionAndAnswer extends React.Component {
  constructor(props) {
    super(props)
    const { questionsAndAnswersFile } = this.props

    this.state = {
      expanded: false,
      questionsAndAnswersFile: questionsAndAnswersFile
    }
    this.toggleExpansion = this.toggleExpansion.bind(this)
  }

  answer() {
    if (this.state.expanded) {
      return <div className="answer">{this.props.qa.answer}</div>
    }
  }

  expandOrCollapseButton() {
    const { questionsAndAnswersFile, expanded } = this.state
    let buttonText = ''

    if (questionsAndAnswersFile == 'premium') {
      const imageLink = expanded ? 'collapse@3x.png' : 'expand@3x.png'
      buttonText = <button type="button"><img alt="expand-and-collapse" src={`${process.env.CDN_URL}/images/shared/${imageLink}`} /></button>
    } else {
      buttonText = expanded ? 'Collapse' : 'Expand'
    }
    return <p className="expand-or-collapse" onClick={this.toggleExpansion}>{buttonText}</p>
  }

  toggleExpansion() {
    this.setState({expanded: !this.state.expanded})
  }

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
