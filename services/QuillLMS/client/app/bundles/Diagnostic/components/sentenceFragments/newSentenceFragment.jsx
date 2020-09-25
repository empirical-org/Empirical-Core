import React from 'react';
import { connect } from 'react-redux';

import Form from './sentenceFragmentForm.jsx';

import fragmentActions from '../../actions/sentenceFragments.ts';

class newSentenceFragment extends React.Component {
  createNewSentenceFragment = (newSentenceFragment) => {
    const { dispatch, history } = this.props
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
        feedback: "That's a strong sentence!",
      }];
    } else {
      data.responses = [{
        text: newSentenceFragment.prompt,
        optimal: true,
        feedback: "That's a strong sentence!",
      }];
    }
    // TODO: fix add sentence fragment action to show new sentence fragment without refreshing
    dispatch(fragmentActions.submitNewSentenceFragment(data, data.responses[0]));
    history.push('/admin/sentence-fragments')
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <h4 className="title is-4">Create a New Sentence Fragment</h4>
          <Form concepts={this.props.concepts} handleChange={this.handleChange} mode="New" submit={this.createNewSentenceFragment} />
        </div>
      </section>
    );
  }
}

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    concepts: state.concepts,
    routing: state.routing,
  };
}

export default connect(select)(newSentenceFragment);
