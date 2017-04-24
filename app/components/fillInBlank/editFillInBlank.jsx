import React, { Component } from 'react';
import { connect } from 'react-redux';

class EditFillInBlank extends Component {

  render() {
    return(
      <div>
        <h1>Hi, I'm an edit form.</h1>
      </div>
    )
  }
}

function select(state) {
  return {
    // sentenceFragments: state.sentenceFragments,
    // concepts: state.concepts,
    routing: state.routing,
  };
}

export default connect(select)(EditFillInBlank);
