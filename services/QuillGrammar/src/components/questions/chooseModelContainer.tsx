import * as React from 'react';
import { connect } from 'react-redux';
import ConceptSelector from '../shared/conceptSelector';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';
import * as questionActions from '../../actions/questions';
import { GrammarActivityState } from '../../reducers/grammarActivitiesReducer'
import { QuestionsReducerState } from '../../reducers/questionsReducer'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { Match } from '../../interfaces/match'

interface ChooseModelContainerState {
  modelConceptUID: string;
  lessonModelConceptUID: string;
}

interface ChooseModelContainerProps {
  lessons: GrammarActivityState;
  questions: QuestionsReducerState;
  match: Match;
  dispatch: Function;
  concepts: ConceptReducerState;
}

class ChooseModelContainer extends React.Component<ChooseModelContainerProps, ChooseModelContainerState> {
  constructor(props: ChooseModelContainerProps) {
    super(props);
    const modelConceptUID = props.questions.data[props.match.params.questionID].modelConceptUID

    let lessonModelConceptUID
    if (props.lessons.data) {
      const lessonUID = Object.keys(props.lessons.data).find((uid) => {
        const lesson = props.lessons.data[uid]
        if (lesson && lesson.questions) {
          return lesson.questions.find(q => q.key === props.match.params.questionID)
        }
      })
      lessonModelConceptUID = lessonUID && props.lessons.data[lessonUID] ? props.lessons.data[lessonUID].modelConceptUID : null
    }

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
    return this.state.modelConceptUID || this.props.questions.data[this.props.match.params.questionID].modelConceptUID;
  }

  saveModelConcept() {
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.match.params.questionID,
      Object.assign({}, this.props.questions.data[this.props.match.params.questionID], {modelConceptUID: this.state.modelConceptUID})));
    window.history.back();
  }

  removeModelConcept() {
    let questionData = Object.assign({}, this.props.questions.data[this.props.match.params.questionID], {modelConceptUID: null});
    this.props.dispatch(questionActions.submitQuestionEdit(this.props.match.params.questionID, questionData));
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
          disabled={this.state.modelConceptUID == this.props.questions.data[this.props.match.params.questionID].modelConceptUID ? true : false}>
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

  renderLessonModelNote(): JSX.Element|void {
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
    lessons: props.grammarActivities,
    questions: props.questions,
    conceptsFeedback: props.conceptsFeedback,
    concepts: props.concepts
  };
}

export default connect(select)(ChooseModelContainer);
