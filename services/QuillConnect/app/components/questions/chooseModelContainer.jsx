import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import ConceptExplanation from '../feedback/conceptExplanation.jsx';
import questionActions from '../../actions/questions.js';

class ChooseModelContainer extends Component {
  constructor(props) {
    super(props);
    const modelConceptUID = props.questions.data[props.params.questionID].modelConceptUID
    const lessonUID = Object.keys(props.lessons.data).find((uid) => {
      const lesson = props.lessons.data[uid]
      return lesson.questions.find(q => q.key === props.params.questionID)
    })
    const lessonModelConceptUID = lessonUID && props.lessons.data[lessonUID] ? props.lessons.data[lessonUID].modelConceptUID : null
    this.state = {
      modelConceptUID,
      lessonModelConceptUID
    }
    this.setState = this.setState.bind(this);
    this.selectConcept = this.selectConcept.bind(this);
    this.saveModelConcept = this.saveModelConcept.bind(this);
    this.removeModelConcept = this.removeModelConcept.bind(this);
  }

  getModelConceptUID() {
    return this.state.modelConceptUID || this.props.questions.data[this.props.params.questionID].modelConceptUID;
  }

  saveModelConcept() {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.params.questionID,
      Object.assign({}, this.props.questions.data[this.props.params.questionID], {modelConceptUID: this.state.modelConceptUID})));
    window.history.back();
  }

  removeModelConcept() {
    let questionData = Object.assign({}, this.props.questions.data[this.props.params.questionID], {modelConceptUID: null});
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.params.questionID, questionData));
  }

  selectConcept(e) {
    this.setState({ modelConceptUID: e.value });
  }

  renderButtons() {
    return(
      <p className="control">
        <button
          className={'button is-primary'}
          onClick={this.saveModelConcept}
          disabled={this.state.modelConceptUID == this.props.questions.data[this.props.params.questionID].modelConceptUID ? 'true' : null}>
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

  renderLessonModelNote() {
    if (this.state.lessonModelConceptUID && this.state.lessonModelConceptUID !== this.state.modelConceptUID) {
      const concept = this.props.concepts.data['0'].find(c => c.uid === this.state.lessonModelConceptUID)
      if (concept) {
        return <div style={{ marginBottom: '10px' }}>
          <p>The activity that this question belongs to has the following Model Concept:</p>
          <p><i>"{concept.displayName}"</i></p>
        </div>
      }
    }
  }

  render() {
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        {this.renderLessonModelNote()}
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
    lessons: props.lessons,
    questions: props.questions,
    conceptsFeedback: props.conceptsFeedback,
    concepts: props.concepts
  };
}

export default connect(select)(ChooseModelContainer);
