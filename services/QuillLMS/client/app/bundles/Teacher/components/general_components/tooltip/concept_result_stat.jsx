import React from 'react'

export default class ConceptResultStat extends React.Component {
  render() {
    return (
      <div className='row'>
        <div className='col-xs-8 no-pl'>{this.props.name}</div>
        <div className='col-xs-2 correct-answer'>{this.props.correct}</div>
        <div className='col-xs-2 no-pr incorrect-answer'>{this.props.incorrect}</div>
      </div>
    );
  }
}
