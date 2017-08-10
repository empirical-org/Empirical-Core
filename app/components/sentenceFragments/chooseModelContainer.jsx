import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import ConceptExplanation from '../feedback/conceptExplanation.jsx';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';

class ChooseModelContainer extends Component {
  constructor() {
    super();
    this.state = {}
    this.setState = this.setState.bind(this);
    this.selectConcept = this.selectConcept.bind(this);
    this.saveModelConcept = this.saveModelConcept.bind(this);
    this.removeModelConcept = this.removeModelConcept.bind(this);
  }

  componentWillMount() {
    this.setState({
      modelConceptUID: this.props.sentenceFragments.data[this.props.params.questionID].modelConceptUID
    })
  }

  getModelConceptUID() {
    return this.state.modelConceptUID || this.props.sentenceFragments.data[this.props.params.questionID].modelConceptUID;
  }

  saveModelConcept() {
    this.props.dispatch(sentenceFragmentActions.submitSentenceFragmentEdit(this.props.params.questionID,
      Object.assign({}, this.props.sentenceFragments.data[this.props.params.questionID], {modelConceptUID: this.state.modelConceptUID})));
    window.history.back();
  }

  removeModelConcept() {
    let questionData = Object.assign({}, this.props.sentenceFragments.data[this.props.params.questionID], {modelConceptUID: null});
    this.props.dispatch(sentenceFragmentActions.submitSentenceFragmentEdit(this.props.params.questionID, questionData));
  }

  selectConcept(e) {
    this.setState({modelConceptUID: e.value});
  }

  renderButtons() {
    return(
      <p className="control">
        <button
          className={'button is-primary'}
          onClick={this.saveModelConcept}
          disabled={this.state.modelConceptUID == this.props.sentenceFragments.data[this.props.params.questionID].modelConceptUID ? 'true' : null}>
          Save Model Concept
        </button>
        <button
          className={'button is-outlined is-info'}
          style={{marginLeft: 5}}
          onClick={() => window.history.back()}>
          Cancel
        </button>
        <button
          className="button is-outlined is-danger"
          style={{marginLeft: 5}}
          onClick={this.removeModelConcept}>
          Remove
        </button>
      </p>
    )
  }

  render() {
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        <div className="control">
          <ConceptSelector onlyShowConceptsWithConceptFeedback currentConceptUID={this.getModelConceptUID()} handleSelectorChange={this.selectConcept} />
          <ConceptExplanation {...this.props.conceptsFeedback.data[this.getModelConceptUID()]} />
          {this.props.children}
        </div>
        {this.renderButtons()}
      </div>
    )
  }

}

function select(props) {
  return {
    sentenceFragments: props.sentenceFragments,
    conceptsFeedback: props.conceptsFeedback
  };
}

export default connect(select)(ChooseModelContainer);
