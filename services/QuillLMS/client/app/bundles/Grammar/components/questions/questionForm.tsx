import { ContentState, EditorState } from 'draft-js'
import * as React from 'react'

import { FlagDropdown, TextEditor } from '../../../Shared/index'
import ConceptSelector from '../shared/conceptSelector'

export default class QuestionForm extends React.Component {
  constructor(props) {
    super(props)

    const { question, } = props

    const { prompt, concept_uid, instructions, flag, rule_description, answers, cues, cues_label, } = question

    this.state = {
      prompt,
      concept_uid,
      instructions: instructions || '',
      flag: flag || "alpha",
      rule_description: rule_description || '',
      answers: answers || [],
      cues: cues ? cues.join(',') : '',
      cues_label: cues_label || ''
    }
  }

  submit = () => {
    const { submit, } = this.props
    const { prompt, concept_uid, instructions, flag, rule_description, answers, cues, cues_label, } = this.state
    submit({
      prompt,
      concept_uid,
      instructions,
      flag,
      rule_description,
      answers,
      cues: cues.split(',').filter(cue => cue.length),
      cues_label
    })
  }

  handlePromptChange = (e) => {
    this.setState({prompt: e})
  }

  handleInstructionsChange = (e) => {
    this.setState({instructions: e.target.value})
  }

  handleRuleDescriptionChange = (e) => {
    this.setState({rule_description: e})
  }

  handleSelectorChange = (e) => {
    this.setState({concept_uid: e.value})
  }

  handleFlagChange = (e) => {
    this.setState({ flag: e.target.value, });
  }

  handleCuesChange = (e) => {
    this.setState({ cues: e.target.value, });
  }

  handleCuesLabelChange = (e) => {
    this.setState({ cues_label: e.target.value, });
  }

  handleAnswersChange = (e) => {
    this.setState({ answers: [{ text: e.target.value }], });
  }

  render() {
    const { concepts, } = this.props
    const { answers, prompt, instructions, flag, concept_uid, rule_description, cues, cues_label, } = this.state
    if (concepts.hasreceiveddata) {
      const optimalAnswer = answers[0] ? answers[0].text : ''
      return (
        <div className="box">
          <h6 className="control subtitle">Create a new question</h6>
          <label className="label">Prompt</label>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handlePromptChange}
            text={prompt || ""}
          />
          <label className="label">Instructions for student</label>
          <p className="control">
            <textarea className="input" defaultValue={instructions} onChange={this.handleInstructionsChange} ref="instructions" type="text" />
          </p>
          <FlagDropdown flag={flag} handleFlagChange={this.handleFlagChange} isLessons={false} />
          <label className="label">Concept</label>
          <div>
            <ConceptSelector
              currentConceptUID={concept_uid}
              handleSelectorChange={this.handleSelectorChange}
            />
          </div>
          <label className="label">Cues Label (default is "choose one", enter a space to have no label)</label>
          <p className="control">
            <input className="input" defaultValue={cues_label} onChange={this.handleCuesLabelChange} type="text" />
          </p>
          <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
          <p className="control">
            <input className="input" defaultValue={cues} onChange={this.handleCuesChange} type="text" />
          </p>
          <label className="label">Rule description (optional, will overwrite the concept's description for this question if set)</label>
          <p className="control">
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={this.handleRuleDescriptionChange}
              text={rule_description}
            />
          </p>
          <label className="label">Optimal answer (you can add more later)</label>
          <p className="control">
            <textarea className="input" defaultValue={optimalAnswer} onChange={this.handleAnswersChange} ref="answers" type="text" />
          </p>
          <br />
          <button className="button is-primary" onClick={this.submit}>Update Question</button>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}
