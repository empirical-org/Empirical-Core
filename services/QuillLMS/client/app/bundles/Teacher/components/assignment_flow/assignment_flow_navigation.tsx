import React from 'react'

export default class AssignmentFlowNavigation extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (<div className="assignment-flow">
      {this.props.children}
    </div>)
  }
}
