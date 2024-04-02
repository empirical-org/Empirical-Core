import { ContentState, EditorState } from 'draft-js';
import * as React from "react";
import { TextEditor } from '../../Shared/index';

export default class RuleDescriptionField extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const showEditor = props.ruleDescription && props.ruleDescription.length && props.ruleDescription !== '<br/>'
    this.state = {
      showEditor: !!showEditor
    }

    this.showEditor = this.showEditor.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  showEditor() {
    this.setState({ showEditor: true })
  }

  cancel() {
    this.setState({ showEditor: false }, () => this.props.handleChange(null))
  }

  renderAddRuleDescription() {
    return (
      <div className="concept-attribute-field rule-description-field">
        <div className="add-concept-attribute-field" onClick={this.showEditor}>
          <i className="fas fa-plus" />
          <p>Add a Grammar rule description (optional)</p>
        </div>
      </div>
    )
  }

  renderRuleDescriptionEditor() {
    const { handleChange, ruleDescription, isNew, } = this.props
    return (
      <div className="concept-attribute-field rule-description">
        <div className="concept-attribute-field-editor">
          <div className="concept-attribute-field-editor-header">
            <p>Grammar rule description (optional)</p>
            {isNew ? '' : <button className="interactive-wrapper focus-on-light remove-concept-attribute-field" onClick={this.cancel} type="button"><i className="fas fa-archive" /><span>Remove</span></button>}
          </div>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={handleChange}
            key="rule-description"
            text={ruleDescription}
          />
          {isNew ? <button className="interactive-wrapper focus-on-light cancel-concept-attribute-field" onClick={this.cancel} type="button">Cancel</button> : ''}
        </div>
      </div>
    )
  }

  render() {
    if (this.state.showEditor) {
      return this.renderRuleDescriptionEditor()
    } else {
      return this.renderAddRuleDescription()
    }
  }
}
