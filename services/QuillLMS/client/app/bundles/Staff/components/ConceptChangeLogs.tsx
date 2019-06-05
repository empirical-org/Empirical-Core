import * as React from "react";
import moment from 'moment'

import { ChangeLog } from '../interfaces/interfaces'

interface ConceptChangeLogProps {
  changeLogs: Array<ChangeLog>
}

interface ConceptChangeLogState {
  open: boolean;
}

export default class ConceptChangeLogs extends React.Component<ConceptChangeLogProps, ConceptChangeLogState> {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }

    this.toggleOpen = this.toggleOpen.bind(this)
    this.renderChangeLogs = this.renderChangeLogs.bind(this)
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

  renderChangeLogs() {
    if (this.state.open) {
      const changeLogItems = this.props.changeLogs.map(cl => {
        return <div className="change-log-item" key={cl.id}>
          <p className="date">{moment.unix(cl.createdAt).format('MMMM D, YYYY [at] LT')}</p>
          <p className="action">Action: {cl.action}</p>
          <p className="explanation">{cl.explanation}</p>
          <p className="user">
            <i className="far fa-user-circle"/>
            <span>{cl.user.name}</span>
          </p>
        </div>
      })
      return <div className="change-log-items">{changeLogItems}</div>
    }
  }

  render() {
    const numberOfChangeLogs = this.props.changeLogs.length
    const { open, } = this.state
    return <div className="concept-change-logs">
      <div className="concept-change-logs-header" onClick={this.toggleOpen}>
        <p>Change log - {numberOfChangeLogs} { numberOfChangeLogs === 1 ? 'edit' : 'edits' }</p>
        <i className={open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} />
      </div>
      {this.renderChangeLogs()}
    </div>
  }
}
