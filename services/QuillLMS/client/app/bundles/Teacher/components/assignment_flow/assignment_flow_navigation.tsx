import React from 'react'

export default class AssignmentFlowNavigation extends React.Component {
  constructor(props) {
    super(props)
  }

  renderButton() {
    const { button, } = this.props
    return button ? button : null
  }

  render() {
    return (<div className="assignment-flow">
      {this.renderButton()}
    </div>)
  }
}
