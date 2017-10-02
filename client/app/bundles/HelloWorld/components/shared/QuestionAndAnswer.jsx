import React from 'react'

export default class QuestionAndAnswer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
    this.toggleExpansion = this.toggleExpansion.bind(this)
  }

  answer() {
    if (this.state.expanded) {
      return <div className="answer">{this.props.qa.answer}</div>
    }
  }

  expandOrCollapseButton() {
    const buttonText = this.state.expanded ? 'Collapse' : 'Expand'
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
