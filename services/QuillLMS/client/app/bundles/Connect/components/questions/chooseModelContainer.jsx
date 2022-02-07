import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { ConceptExplanation } from '../../../Shared/index';
import questionActions from '../../actions/questions';

class ChooseModelContainer extends Component {
  constructor(props) {
    super(props);

    const { lessons, match, questions } = props
    const { params } = match
    const { questionID } = params
    const modelConceptUID = questions.data[questionID].modelConceptUID
    const lessonUID = Object.keys(lessons.data).find((uid) => {
      const lesson = lessons.data[uid]
      if (!lesson.questions) return false;
      return lesson.questions.find(q => q.key === questionID)
    })
    const lessonModelConceptUID = lessonUID && lessons.data[lessonUID] ? lessons.data[lessonUID].modelConceptUID : null
    this.state = {
      modelConceptUID,
      lessonModelConceptUID
    }
  }

  getModelConceptUID = () => {
    const { modelConceptUID } = this.state
    const { match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID } = params
    return modelConceptUID || data[questionID].modelConceptUID;
  }

  removeModelConcept = () => {
    const { dispatch, match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID } = params
    let questionData = Object.assign({}, data[questionID], {modelConceptUID: null});
    dispatch(questionActions.submitQuestionEdit(questionID, questionData));
    window.history.back();
  };

  saveModelConcept = () => {
    const { modelConceptUID } = this.state
    const { dispatch, match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID } = params
    dispatch(questionActions.submitQuestionEdit(questionID,
      Object.assign({}, data[questionID], {modelConceptUID: modelConceptUID})));
    window.history.back();
  };

  selectConcept = e => {
    this.setState({ modelConceptUID: e.value });
  };

  renderButtons = () => {
    const { modelConceptUID } = this.state
    const { match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID } = params
    return(
      <p className="control">
        <button
          className="button is-primary"
          disabled={modelConceptUID === data[questionID].modelConceptUID}
          onClick={this.saveModelConcept}
        >
          Save Model Concept
        </button>
        <button
          className="button is-outlined is-info"
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

  renderLessonModelNote = () => {
    const { lessonModelConceptUID, modelConceptUID } = this.state
    const { concepts } = this.props
    const { data } = concepts
    if (lessonModelConceptUID && lessonModelConceptUID !== modelConceptUID) {
      const concept = data['0'].find(c => c.uid === lessonModelConceptUID)
      if (concept) {
        return (
          <div style={{ marginBottom: '10px' }}>
            <p>The activity that this question belongs to has the following Model Concept:</p>
            <p><i>"{concept.displayName}"</i></p>
          </div>
        )
      }
    }
  }

  render() {
    const { conceptsFeedback } = this.props
    const { data } = conceptsFeedback
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        {this.renderLessonModelNote()}
        <div className="control">
          <ConceptSelector currentConceptUID={this.getModelConceptUID()} handleSelectorChange={this.selectConcept} onlyShowConceptsWithConceptFeedback />
          <ConceptExplanation {...data[this.getModelConceptUID()]} />
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
