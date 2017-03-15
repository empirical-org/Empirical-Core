import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TextEditor from '../renderForQuestions/renderTextEditor.jsx';
import _ from 'underscore';
import ReactTransition from 'react-addons-css-transition-group';
import POSMatcher from '../../libs/sentenceFragment.js';
import fragmentActions from '../../actions/sentenceFragments.js';
import {
  submitNewResponse,
  incrementChildResponseCount,
  incrementResponseCount,
  getResponsesWithCallback,
  getGradedResponsesWithCallback
} from '../../actions/responses.js';
import icon from '../../img/question_icon.svg';
import updateResponseResource from '../renderForQuestions/updateResponseResource.js';
import { hashToCollection } from '../../libs/hashToCollection.js';

const key = ''; // enables this component to be used by both play/sentence-fragments and play/diagnostic

const PlaySentenceFragment = React.createClass({
  getInitialState() {
    return {
      response: this.props.question.prompt,
      checkAnswerEnabled: true,
      submitted: false,
    };
  },

  componentDidMount() {
    getGradedResponsesWithCallback(
      this.getQuestion().key,
      (data) => {
        this.setState({ responses: data, });
      }
    );
  },

  choosingSentenceOrFragment() {
    const { question, } = this.props;
    return question.identified === undefined && (question.needsIdentification === undefined || question.needsIdentification === true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  },

  showNextQuestionButton() {
    const { question, } = this.props;
    const attempted = question.attempts.length > 0;
    if (attempted) {
      return true;
    } else {
      return false;
    }
  },

  getQuestion() {
    const { question, } = this.props;
    if (question.key.endsWith('-esp')) {
      question.key = question.key.slice(0, -4);
    }
    return question;
  },

  getResponses() {
    return this.state.responses;
  },

  checkChoice(choice) {
    const questionType = this.props.question.isFragment ? 'Fragment' : 'Sentence';
    this.props.markIdentify(choice === questionType);
  },

  getSentenceOrFragmentButtons() {
    return (
      <div className="sf-button-group">
        <button className="button sf-button" value="Sentence" onClick={() => { this.checkChoice('Sentence'); }}>Complete / Completa la oración</button>
        <button className="button sf-button" value="Fragment" onClick={() => { this.checkChoice('Fragment'); }}>Incomplete / Oración incompleta</button>
      </div>
    );
  },

  handleChange(e) {
    this.setState({ response: e, });
  },

  handleAttemptSubmission() {
    if (this.state.submitted === false) {
      this.setState(
        { submitted: true, },
        this.props.nextQuestion()
      );
    }
  },

  checkAnswer() {
    if (this.state.checkAnswerEnabled && this.state.responses) {
      const key = this.getQuestion().key;
      const { attempts, } = this.props.question;
      this.setState({ checkAnswerEnabled: false, }, () => {
        const { prompt, wordCountChange, ignoreCaseAndPunc, } = this.getQuestion();
        const fields = {
          prompt,
          responses: hashToCollection(this.getResponses()),
          questionUID: key,
          wordCountChange,
          ignoreCaseAndPunc,
        };
        const responseMatcher = new POSMatcher(fields);
        const matched = responseMatcher.checkMatch(this.state.response);
        updateResponseResource(matched, key, attempts, this.props.dispatch, );
        this.props.updateAttempts(matched);
        this.setState({ checkAnswerEnabled: true, });
        this.handleAttemptSubmission();
      });
    }
  },

  renderSentenceOrFragmentMode() {
    if (this.choosingSentenceOrFragment()) {
      return (
        <div className="container">
          <ReactTransition transitionName={'sentence-fragment-buttons'} transitionLeave transitionLeaveTimeout={2000}>
            <div className="feedback-row">
              <img className="info" src={icon} />
              <p>Is this a complete or an incomplete sentence?</p>
            </div>
            <div className="feedback-row">
              <img className="info" src={icon} />
              <p>Esta oración esta complete o incompleta?</p>
            </div>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      );
    } else {
      return (<div />);
    }
  },

  renderPlaySentenceFragmentMode(fragment) {
    const button = <button className="button student-submit" onClick={this.checkAnswer}>Submit | Enviar</button>;

    if (!this.choosingSentenceOrFragment()) {
      // let instructions;
      let component;
      if (this.props.question.instructions && this.props.question.instructions !== '') {
        component = (
          <div className="feedback-row">
            <img className="info" src={icon} />
            <p dangerouslySetInnerHTML={{ __html: this.props.question.instructions, }} />
          </div>
        );
        // instructions = this.props.question.instructions;
      } else {
        component = (
          <div className="feedback-row">
            <img className="info" src={icon} />
            <p>
              If it is a complete sentence, press submit. If it is an incomplete sentence, make it complete.
              <br /><br />
              Si es una oración completa, aprieta el botón que dice “enviar”. Si es una oración incompleta, complete la oración ahora.
            </p>
          </div>
        );
        // instructions = 'Añadir al grupo de palabras para hacer una oración completa. Añada el menor número posible de palabras.';
      }

      return (
        <div className="container">
          <ReactTransition
            transitionName={'text-editor'} transitionAppear transitionAppearTimeout={1200}
            transitionLeaveTimeout={300}
          >
            {component}
            <TextEditor value={this.state.response} handleChange={this.handleChange} disabled={this.showNextQuestionButton()} checkAnswer={this.checkAnswer} />
            <div className="question-button-group">
              {button}
            </div>
          </ReactTransition>
        </div>
      );
    }
  },

  render() {
    const fragment = this.getQuestion();
    return (
      <div className="student-container-inner-diagnostic">
        <div className="draft-js sentence-fragments prevent-selection">
          <p>{this.getQuestion().prompt}</p>
        </div>

        {this.renderSentenceOrFragmentMode()}
        {this.renderPlaySentenceFragmentMode(fragment)}
      </div>
    );
  },
});

function select(state) {
  return {
    routing: state.routing,
  };
}

export default connect(select)(PlaySentenceFragment);
