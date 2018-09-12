import * as React from 'react'
import {
  hashToCollection,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import { connect } from 'react-redux'
import TextEditor from '../shared/textEditor'
import * as questionActions from '../../actions/questions'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { QuestionsReducerState } from '../../reducers/questionsReducer'
import { Match } from '../../interfaces/match'
import { Question } from '../../interfaces/questions'
import { Link } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js'
import _ from 'underscore'

interface ConceptState {
  prompt: string;
  concept_uid: string|undefined;
  instructions: string;
  flag: string;
  rule_description: string;
  answers: Array<Answer>;
}

interface ConceptProps {
  concepts: ConceptReducerState;
  match: Match;
  questions: QuestionsReducerState;
  dispatch: Function;
}

interface Answer {
  text: string;
}

class Concept extends React.Component<ConceptProps, ConceptState> {
  constructor(props: ConceptProps) {
    super(props)

    this.state = {
      prompt: '',
      concept_uid: props.match.params.conceptID,
      instructions: '',
      flag: 'alpha',
      rule_description: '',
      answers: []
    }

    this.submit = this.submit.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.handleRuleDescriptionChange = this.handleRuleDescriptionChange.bind(this)
    this.handleSelectorChange = this.handleSelectorChange.bind(this)
    this.handleConceptChange = this.handleConceptChange.bind(this)
    this.handleFlagChange = this.handleFlagChange.bind(this)
    this.handleAnswersChange = this.handleAnswersChange.bind(this)
  }

  getConcept() {
    const {data} = this.props.concepts, {conceptID} = this.props.match.params;
    return data[0].find(c => c.uid === conceptID)
  }

  questionsForConcept() {
    const questionsCollection = hashToCollection(this.props.questions.data)
    return _.where(questionsCollection, {concept_uid: this.props.match.params.conceptID})
  }

  renderQuestionsForConcept() {
    const questionsForConcept = this.questionsForConcept()
    const listItems = questionsForConcept.map((question: Question) => {
      return (<li key={question.key}><Link to={'/admin/questions/' + question.key + '/responses'}>{question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</Link></li>)
    })
    return (
      <ul>{listItems}</ul>
    )
  }

  submit():void {
    if (this.state.prompt !== '') {
      this.props.dispatch(questionActions.submitNewQuestion({
        prompt: this.state.prompt,
        concept_uid: this.state.concept_uid,
        instructions: this.state.instructions,
        flag: this.state.flag,
        rule_description: this.state.rule_description,
        answers: this.state.answers
      }))
    }
  }

  handlePromptChange (e: string) {
    this.setState({prompt: e})
  }

  handleInstructionsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({instructions: e.target.value})
  }

  handleRuleDescriptionChange(e: string) {
    this.setState({rule_description: e})
  }

  handleSelectorChange(e: {value: string}) {
    this.setState({concept_uid: e.value})
  }

  handleConceptChange() {
    this.setState({concept_uid: this.refs.concept.value})
  }

  handleFlagChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ flag: e.target.value, });
  }

  handleAnswersChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ answers: [{ text: e.target.value }], });
  }

  render () {
    const {data} = this.props.concepts, {conceptID} = this.props.match.params;
    if (this.props.concepts.hasreceiveddata && this.getConcept()) {
      return (
        <div>
          <Link to ={'/admin/concepts'}>Return to All Concepts</Link>
          <h4 className="title">{this.getConcept().displayName}</h4>
          <h6 className="subtitle">{this.questionsForConcept().length} Questions</h6>
          <div className="box">
            <h6 className="control subtitle">Create a new question</h6>
            <label className="label">Prompt</label>
            <TextEditor
              handleTextChange={this.handlePromptChange}
              EditorState={EditorState}
              ContentState={ContentState}
            />
            <label className="label">Instructions for student</label>
            <p className="control">
              <textarea className="input" ref="instructions" onChange={this.handleInstructionsChange}></textarea>
            </p>
            <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false}/>
            <label className="label">Rule description</label>
            <p className="control">
              <TextEditor
                handleTextChange={this.handleRuleDescriptionChange}
                EditorState={EditorState}
                ContentState={ContentState}
              />
            </p>
            <label className="label">Optimal answer (you can add more later)</label>
            <p className="control">
              <textarea className="input" ref="answers" onChange={this.handleAnswersChange}></textarea>
            </p>
            <br/>
            <button className="button is-primary" onClick={this.submit}>Create Question</button>
          </div>
          {this.renderQuestionsForConcept()}
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}

function select(state: any) {
  return {
    concepts: state.concepts,
    questions: state.questions
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(Concept)
