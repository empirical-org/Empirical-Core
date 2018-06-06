import React from 'react';
import { connect } from 'react-redux';
import fragmentActions from '../../actions/sentenceFragments.js';
import Form from './sentenceFragmentForm.jsx';

const newSentenceFragment = React.createClass({

  createNewSentenceFragment(newSentenceFragment) {
    if (!newSentenceFragment.isFragment && !newSentenceFragment.needsIdentification) {
      alert('If the prompt is a sentence, the student must identify whether it is a sentence or fragment. Please try again.');
      return;
    }
    const data = {};
    data.prompt = newSentenceFragment.prompt;
    data.isFragment = newSentenceFragment.isFragment;
    data.needsIdentification = newSentenceFragment.needsIdentification;
    data.optimalResponseText = newSentenceFragment.optimalResponseText;
    data.wordCountChange = newSentenceFragment.wordCountChange;
    data.conceptID = newSentenceFragment.conceptID;
    if (newSentenceFragment.isFragment) {
      data.responses = [{
        text: newSentenceFragment.optimalResponseText,
        optimal: true,
        feedback: "That's a great answer!",
      }];
    } else {
      data.responses = [{
        text: newSentenceFragment.prompt,
        optimal: true,
        feedback: "That's a great answer!",
      }];
    }

    this.props.dispatch(fragmentActions.submitNewSentenceFragment(data, data.responses[0]));
  },

  render() {
    return (
      <section className="section">
        <div className="container">
          <h4 className="title is-4">Create a New Sentence Fragment</h4>
          <Form mode="New" handleChange={this.handleChange} submit={this.createNewSentenceFragment} concepts={this.props.concepts} />
        </div>
      </section>
    );
  },

});

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    concepts: state.concepts,
    routing: state.routing,
  };
}

export default connect(select)(newSentenceFragment);
