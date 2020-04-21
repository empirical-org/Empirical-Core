import React from 'react';
import { connect } from 'react-redux';
import fragmentActions from '../../actions/sentenceFragments';
import Form from './sentenceFragmentForm.jsx';

class newSentenceFragment extends React.Component {
  createNewSentenceFragment = (newSentenceFragment) => {
    const { dispatch } = this.props
    const { isFragment, needsIdentification, prompt, optimalResponseText, wordCountChange, conceptID } = newSentenceFragment
    if (!isFragment && !needsIdentification) {
      alert('If the prompt is a sentence, the student must identify whether it is a sentence or fragment. Please try again.');
      return;
    }
    let data = {
      prompt,
      isFragment,
      needsIdentification,
      optimalResponseText,
      wordCountChange,
      conceptID
    };
    if (isFragment) {
      data.responses = [{
        text: optimalResponseText,
        optimal: true,
        feedback: "That's a strong sentence!",
      }];
    } else {
      data.responses = [{
        text: prompt,
        optimal: true,
        feedback: "That's a strong sentence!",
      }];
    }

    dispatch(fragmentActions.submitNewSentenceFragment(data, data.responses[0]));
  };

  render() {
    const { concepts } = this.props
    return (
      <section className="section">
        <div className="container">
          <h4 className="title is-4">Create a New Sentence Fragment</h4>
          <Form concepts={concepts} handleChange={this.handleChange} mode="New" submit={this.createNewSentenceFragment} />
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
