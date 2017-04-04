import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import ConceptExplanation from '../feedback/conceptExplanation.jsx';
import questionActions from '../../actions/questions.js';

class ChooseModelContainer extends Component {
  constructor() {
    super();
    this.state = {}
    this.setState = this.setState.bind(this);
    this.selectConcept = this.selectConcept.bind(this);
    this.saveModelConcept = this.saveModelConcept.bind(this);
  }

  getModelConceptUID() {
    return this.state.modelConceptUID || this.props.questions.data[this.props.params.questionID].modelConceptUID;
  }

  saveModelConcept() {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.params.questionID,
      Object.assign({}, this.props.questions.data[this.props.params.questionID], {modelConceptUID: this.state.modelConceptUID})));
    window.history.back();
  }

  selectConcept(e) {
    this.setState({modelConceptUID: e.value});
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
        <p className="control">
          <button className={'button is-primary '} onClick={this.saveModelConcept}>Save Model Concept</button>
          <button className={'button is-outlined is-info'} style={{marginLeft: 5}} onClick={() => window.history.back()}>Cancel</button>
        </p>
      </div>
    )
  }

}

function select(props) {
  return {
    questions: props.questions,
    conceptsFeedback: props.conceptsFeedback
  };
}

export default connect(select)(ChooseModelContainer);
