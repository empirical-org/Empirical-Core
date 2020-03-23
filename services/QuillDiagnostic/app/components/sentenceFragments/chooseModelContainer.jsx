import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';

class ChooseModelContainer extends Component {
  constructor() {
    super();
    this.state = {}
    this.setState = this.setState.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { params, sentenceFragments } = this.props;
    const { data } = sentenceFragments;
    const { questionID } = params;
    this.setState({
      modelConceptUID: data[questionID].modelConceptUID
    })
  }

  getModelConceptUID() {
    const { modelConceptUID } = this.state;
    const { params, sentenceFragments } = this.props;
    const { data } = sentenceFragments;
    const { questionID } = params;
    return modelConceptUID || data[questionID].modelConceptUID;
  }

  saveModelConcept = () => {
    const { modelConceptUID } = this.state;
    const { dispatch, params, sentenceFragments } = this.props;
    const { questionID } = params;
    const { data } = sentenceFragments;
    dispatch(sentenceFragmentActions.submitSentenceFragmentEdit(questionID,
      Object.assign({}, data[questionID], {modelConceptUID: modelConceptUID})));
    window.history.back();
  };

  removeModelConcept = () => {
    const { dispatch, params, sentenceFragments } = this.props;
    const { questionID } = params;
    const { data } = sentenceFragments;
    let questionData = Object.assign({}, data[questionID], {modelConceptUID: null});
    dispatch(sentenceFragmentActions.submitSentenceFragmentEdit(questionID, questionData));
  };

  selectConcept = e => {
    this.setState({modelConceptUID: e.value});
  };

  renderButtons() {
    const { modelConceptUID } = this.state;
    const { params, sentenceFragments } = this.props;
    const { questionID } = params;
    const { data } = sentenceFragments;
    return(
      <p className="control">
        <button
          className={'button is-primary'}
          disabled={modelConceptUID === data[questionID].modelConceptUID ? 'true' : null}
          onClick={this.saveModelConcept}
        >
          Save Model Concept
        </button>
        <button
          className={'button is-outlined is-info'}
          onClick={() => window.history.back()}
          style={{marginLeft: 5}}
        >
          Cancel
        </button>
        <button
          className="button is-outlined is-danger"
          onClick={this.removeModelConcept}
          style={{marginLeft: 5}}
        >
          Remove
        </button>
      </p>
    )
  }

  render() {
    const { children, conceptsFeedback } = this.props;
    const { data } = conceptsFeedback;
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        <div className="control">
          <ConceptSelector currentConceptUID={this.getModelConceptUID()} handleSelectorChange={this.selectConcept} onlyShowConceptsWithConceptFeedback />
          <ConceptExplanation {...data[this.getModelConceptUID()]} />
          {children}
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
