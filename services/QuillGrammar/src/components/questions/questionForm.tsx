import * as React from 'react'
import {
  hashToCollection,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import TextEditor from '../shared/textEditor'
import { EditorState, ContentState } from 'draft-js'
import ConceptSelector from '../shared/conceptSelector'

export default class QuestionForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prompt: this.props.question,
      concept_uid: this.props.question.concept_uid,
      instructions: this.props.question.instructions ? this.props.question.instructions : "",
      flag: this.props.question.flag ? this.props.question.flag : "alpha",
      rule_description: this.props.question.rule_description ? this.props.question.rule_description : '',
      answers: this.props.question.answers ? this.props.question.answers : []
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

  submit () {
    this.props.submit({
      prompt: this.state.prompt,
      concept_uid: this.state.concept_uid,
      instructions: this.state.instructions,
      flag: this.state.flag,
      rule_description: this.state.rule_description,
      answers: this.state.answers
    })
  }

  handlePromptChange (e) {
    this.setState({prompt: e})
  }

  handleInstructionsChange(e) {
    this.setState({instructions: e.target.value})
  }

  handleRuleDescriptionChange(e) {
    this.setState({rule_description: e})
  }

  handleSelectorChange(e) {
    this.setState({concept_uid: e.value})
  }

  handleConceptChange() {
    this.setState({concept_uid: this.refs.concept.value})
  }

  handleFlagChange(e) {
    this.setState({ flag: e.target.value, });
  }

  handleAnswersChange(e) {
    this.setState({ answers: [{ text: e.target.value }], });
  }

  render () {
    if(this.props.concepts.hasreceiveddata) {
      const optimalAnswer = this.props.question.answers[0] ? this.props.question.answers[0].text : ''
      return (
        <div className="box">
          <h6 className="control subtitle">Create a new question</h6>
          <label className="label">Prompt</label>
          <TextEditor
            text={this.props.question.prompt || ""}
            handleTextChange={this.handlePromptChange}
            EditorState={EditorState}
            ContentState={ContentState}
          />
          <label className="label">Instructions for student</label>
          <p className="control">
            <textarea className="input" type="text" ref="instructions" defaultValue={this.props.question.instructions} onChange={this.handleInstructionsChange}></textarea>
          </p>
          <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false}/>
          <label className="label">Concept</label>
          <div>
            <ConceptSelector currentConceptUID={this.state.concept_uid}
              handleSelectorChange={this.handleSelectorChange}/>
          </div>
          <label className="label">Rule description</label>
          <p className="control">
            <TextEditor
              text={this.props.question.rule_description || ""}
              handleTextChange={this.handleRuleDescriptionChange}
              EditorState={EditorState}
              ContentState={ContentState}
            />
          </p>
          <label className="label">Optimal answer (you can add more later)</label>
          <p className="control">
            <textarea className="input" type="text" ref="answers" defaultValue={optimalAnswer} onChange={this.handleAnswersChange}></textarea>
          </p>
          <br/>
          <button className="button is-primary" onClick={this.submit}>Update Question</button>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}
