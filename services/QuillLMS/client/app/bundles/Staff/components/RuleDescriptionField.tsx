import * as React from "react";
import { EditorState, ContentState } from 'draft-js'
import { TextEditor } from 'quill-component-library/dist/componentLibrary'

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
    this.setState({ showEditor: true }, () => console.log(this.state))
  }

  cancel() {
    this.setState({ showEditor: false }, () => this.props.handleChange(null))
  }

  renderAddRuleDescription() {
    console.log('ima render the rule description')
    return (<div className="rule-description">
      <div className="add-rule-description" onClick={this.showEditor}>
        <i className="fas fa-plus" />
        <p>Add a Grammar rule description (optional)</p>
      </div>
    </div>)
  }

  renderRuleDescriptionEditor() {
    return (<div className="rule-description">
      <div className="rule-description-editor">
        <div className="rule-description-editor-header">
          <p>Grammar rule description (optional)</p>
          {this.props.new ? '' : <p className="remove-rule-description" onClick={this.cancel}><i className="fas fa-archive" /><span>Remove</span></p>}
        </div>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={this.props.handleChange}
          key="rule-description"
          text={this.props.ruleDescription}
        />
        {this.props.new ? <p className="cancel-rule-description" onClick={this.cancel}>Cancel</p> : ''}
      </div>
    </div>)
  }

  render() {
    if (this.state.showEditor) {
      return this.renderRuleDescriptionEditor()
    } else {
      return this.renderAddRuleDescription()
    }
  }
}
