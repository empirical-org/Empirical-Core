import * as React from "react";
import { EditorState, ContentState } from 'draft-js'
import { TextEditor } from '../../Shared/index'

export default class ExplanationField extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const showEditor = props.explanation && props.explanation.length && props.explanation !== '<br/>'

    this.state = {
      showEditor: !!showEditor
    }
  }

  showEditor = () => {
    this.setState({ showEditor: true })
  }

  cancel = () => {
    this.setState({ showEditor: false })
  }

  renderAddExplanation() {
    return (
      <div className="concept-attribute-field concept-explanation-field">
        <div className="add-concept-attribute-field" onClick={this.showEditor}>
          <i className="fas fa-plus" />
          <p>Add a concept explanation (optional)</p>
        </div>
      </div>
    )
  }

  renderExplanationEditor = () => {
    const { isNew, explanation, handleChange, } = this.props
    return (
      <div className="concept-attribute-field concept-explanation-field">
        <div className="concept-attribute-field-editor">
          <div className="concept-attribute-field-editor-header">
            <p>Concept explanation (optional)</p>
            {isNew ? '' : <button className="interactive-wrapper focus-on-light remove-concept-attribute-field" onClick={this.cancel} type="button"><i className="fas fa-archive" /><span>Remove</span></button>}
          </div>
          <p className="concept-attribute-field-editor-subheader">Displays in Proofreader</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleChange}
            key="concept-explanation"
            text={explanation}
          />
          {isNew ? <button className="interactive-wrapper focus-on-light cancel-concept-attribute-field" onClick={this.cancel} type="button">Cancel</button> : ''}
        </div>
      </div>
    )
  }

  render() {
    const { showEditor, } = this.state
    return showEditor ? this.renderExplanationEditor() : this.renderAddExplanation()
  }
}
