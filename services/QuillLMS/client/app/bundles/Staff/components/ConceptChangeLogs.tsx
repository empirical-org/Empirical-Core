import * as React from "react";

export default class ConceptChangeLogs extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }

    this.toggleOpen = this.toggleOpen.bind(this)
  }

  toggleOpen() {
    this.setState({ open: !this.state.open, })
  }
  //
  // renderAddRuleDescription() {
  //   return <div className="rule-description">
  //     <div className="add-rule-description" onClick={this.toggleOpen}>
  //       <i className="fas fa-plus" />
  //       <p>Add a Grammar rule description (optional)</p>
  //     </div>
  //   </div>
  // }
  //
  // renderRuleDescriptionEditor() {
  //   return <div className="rule-description">
  //     <div className="rule-description-editor">
  //       <div className="rule-description-editor-header">
  //         <p>Grammar rule description (optional)</p>
  //         {this.props.new ? '' : <p className="remove-rule-description" onClick={this.cancel}><i className="fas fa-archive"/><span>Remove</span></p>}
  //       </div>
  //       <TextEditor
  //         text={this.props.ruleDescription}
  //         handleTextChange={this.props.handleChange}
  //         ContentState={ContentState}
  //         EditorState={EditorState}
  //         key="rule-description"
  //       />
  //       {this.props.new ? <p className="cancel-rule-description" onClick={this.cancel}>Cancel</p> : ''}
  //     </div>
  //   </div>
  // }

  render() {
    const numberOfChangeLogs = this.props.changeLogs.length
    const { open, } = this.state
    return <div className="concept-change-logs">
      <div className="concept-change-logs-header">
        <p>Change log - {numberOfChangeLogs} { numberOfChangeLogs === 1 ? 'edit' : 'edits' }</p>
        <i className={open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} />
      </div>
    </div>
  }
}
