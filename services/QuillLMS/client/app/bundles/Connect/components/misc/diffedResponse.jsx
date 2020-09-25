import React, { Component } from 'react';
import { connect } from 'react-redux';

const jsDiff = require('diff');

export class DiffedResponse extends Component {

  generateDiff() {
    const diff = jsDiff.diffWords(this.props.firstResponse, this.props.newResponse);
    const spans = diff.map((part) => {
      let color = '#333333';
      let backgroundColor = '#ffffff';
      if(part.added) {
        color ='#008514';
        backgroundColor = '#f6fef9';
      } else if(part.removed) {
        color = '#B30014';
        backgroundColor = '#fff5f7';
      }
      const divStyle = {
        color,
        backgroundColor,
      };
      return <span style={divStyle}>{part.value}</span>;
    });
    return spans;
  }

  render() {
    return(
      <div style={{marginBottom: 8}}>
        {this.generateDiff()}
      </div>
    )
  }

}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(DiffedResponse);
