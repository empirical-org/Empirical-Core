import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import request from 'request'

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    this.state = {
      suggestedSequences: []
    }

    this.submitSequenceForm = this.submitSequenceForm.bind(this);
    this.getSuggestedSequences = this.getSuggestedSequences.bind(this);
  }

  submitSequenceForm(data) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.params.questionID, data));
    window.history.back();
  }


  componentWillMount() {
    this.getSuggestedSequences()
  }

  getSuggestedSequences() {
    request(
      {
        url: `${process.env.QUILL_CMS}/responses/${this.props.params.questionID}/incorrect_sequences`,
        method: 'GET',
      },
        (err, httpResponse, data) => {
          this.setState({
            suggestedSequences: JSON.parse(data),
          });
        }
      );
    }

  render() {
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm itemLabel='Incorrect Sequence' onSubmit={this.submitSequenceForm} suggestedSequences={this.state.suggestedSequences}/>
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
