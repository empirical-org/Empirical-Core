import * as React from 'react';
import { connect } from 'react-redux';
import ConceptSelector from '../shared/conceptSelector';
import { ConceptExplanation } from '../../../Shared/index';
import * as questionActions from '../../actions/questions';
import { GrammarActivityState } from '../../reducers/grammarActivitiesReducer'
import { QuestionsReducerState } from '../../reducers/questionsReducer'
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { Match } from '../../interfaces/match'

interface ChooseModelContainerState {
  modelConceptUID: string|undefined;
}

interface ChooseModelContainerProps {
  lessons: GrammarActivityState;
  questions: QuestionsReducerState;
  match: Match;
  dispatch: Function;
  concepts: ConceptReducerState;
  conceptsFeedback: ConceptsFeedbackState;
}

class ChooseModelContainer extends React.Component<ChooseModelContainerProps, ChooseModelContainerState> {
  constructor(props: ChooseModelContainerProps) {
    super(props);

    const { questionID } = props.match.params
    const modelConceptUID = questionID ? props.questions.data[questionID].modelConceptUID : undefined

    this.state = {
      modelConceptUID,
    }

    this.setState = this.setState.bind(this);
    this.selectConcept = this.selectConcept.bind(this);
    this.saveModelConcept = this.saveModelConcept.bind(this);
    this.removeModelConcept = this.removeModelConcept.bind(this);
  }

  getModelConceptUID(): string {
    const { questionID } = this.props.match.params
    const questionModelConceptUID = questionID ? this.props.questions.data[questionID].modelConceptUID : null
    return this.state.modelConceptUID || questionModelConceptUID;
  }

  saveModelConcept() {
    const { questionID } = this.props.match.params
    if (questionID) {
      this.props.dispatch(questionActions.submitQuestionEdit(questionID,
        Object.assign({}, this.props.questions.data[questionID], {modelConceptUID: this.state.modelConceptUID})));
      window.history.back();
    }
  }

  removeModelConcept() {
    const { questionID } = this.props.match.params
    if (questionID) {
      const questionData = Object.assign({}, this.props.questions.data[questionID], {modelConceptUID: null});
      this.props.dispatch(questionActions.submitQuestionEdit(questionID, questionData));
    }
  }

  selectConcept(e: {value: string}) {
    this.setState({ modelConceptUID: e.value });
  }

  renderButtons() {
    const { questionID } = this.props.match.params
    const disabled = questionID && this.state.modelConceptUID === this.props.questions.data[questionID].modelConceptUID
    return(
      <p className="control">
        <button
          className="button is-primary"
          disabled={!!disabled}
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

  render() {
    const modelConceptUID = this.getModelConceptUID()
    let conceptFeedback
    if (modelConceptUID) {
      conceptFeedback = this.props.conceptsFeedback.data[modelConceptUID]
    }
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        <div className="control">
          <ConceptSelector
            currentConceptUID={this.getModelConceptUID() || ''}
            handleSelectorChange={this.selectConcept}
            onlyShowConceptsWithConceptFeedback
          />
          <ConceptExplanation {...conceptFeedback} />
          {this.props.children}
        </div>
        {this.renderButtons()}
      </div>
    )
  }

}

function select(props: any) {
  return {
    lessons: props.grammarActivities,
    questions: props.questions,
    conceptsFeedback: props.conceptsFeedback,
    concepts: props.concepts
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ChooseModelContainer);
