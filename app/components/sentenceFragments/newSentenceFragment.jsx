import React from 'react';
import { connect } from 'react-redux';
import {submitNewSentenceFeedback} from '../../actions/sentenceFragments'
import Form from './sentenceFragmentForm.jsx'
const newSentenceFragment = React.createClass({

  getInitialState: function () {
    return {
      prompt: "Is this a sentence?",
      questionText: "",
      isFragment: false,
      optimalResponseText: ""
      // needsIdentification: true
    }
  },

  handleChange: function (key, e) {
    switch (key) {
      case 'prompt':
        this.setState({prompt: e.target.value})
        break;
      case 'questionText':
        this.setState({questionText: e.target.value})
        break;
      case 'optimalResponseText':
        this.setState({optimalResponseText: e.target.value})
        break;
      case 'isFragment':
        this.setState({isFragment: e.target.checked})
      //   break;
      // case 'needsIdentification':
      //   this.setState({needsIdentification: e.target.checked})
      default:
        return
    }
  },

  create: function () {
    const data = {};
    data.prompt = this.state.prompt
    data.questionText = this.state.questionText
    data.isFragment = this.state.isFragment
    // data.needsIdentification = this.state.needsIdentification
    if (this.state.isFragment) {
      data.responses = [{
        text: this.state.optimalResponseText,
        optimal: true,
        feedback: "That's a great answer!"
      }]
    } else {
      data.responses = [{
        text: this.state.questionText,
        optimal: true,
        feedback: "That's a great answer!"
      }]
    }

    this.props.dispatch(submitNewSentenceFeedback(data))
  },

  render: function () {
    return (
      <section className="section">
        <div className="container">
          <h4 className="title is-4">Create a new Sentence Fragment</h4>
          <Form data={this.state} handleChange={this.handleChange} submit={this.create}/>
        </div>
      </section>
    )
  }

})

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    routing: state.routing
  }
}

export default connect(select)(newSentenceFragment)
