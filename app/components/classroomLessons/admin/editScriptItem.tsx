import React, {Component} from 'react'
import ScriptComponent from '../shared/scriptComponent'
import MultipleTextEditor from '../shared/multipleTextEditor'
import { textEditorInputNotEmpty, textEditorInputClean } from '../shared/textEditorClean'

import * as IntF from '../interfaces';

class EditScriptItem extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      scriptItem: this.props.scriptItem;
    }
    this.saveChanges = this.saveChanges.bind(this)
  }

  updateValue(e, value) {
    const newScriptItem = Object.assign({}, this.state.scriptItem)
    newScriptItem.data[value] = e.target.value
    this.setState({scriptItem: newScriptItem})
  }

  updateBody(e) {
    const newScriptItem = Object.assign({}, this.state.scriptItem)
    newScriptItem.data.body = e;
    this.setState({scriptItem: newScriptItem})
  }

  saveChanges() {
    this.props.save(this.state.scriptItem)
  }

  renderForm() {
    switch (this.props.scriptItem.type) {
      case 'STEP-HTML':
        return (<div className="admin-show-script-item">
          <textarea onChange={(e) => this.updateValue(e, 'heading')} value={this.state.scriptItem.data.heading}></textarea>
          <MultipleTextEditor
            text={this.state.scriptItem.data.body}
            handleTextChange={(e) => this.updateBody(e)}
            title={"Body Copy:"}
          />
        </div>)
    }
  }

  render() {
    return (
      <div>
        <ScriptComponent script={[this.state.scriptItem]} />
        {this.renderForm()}
        <button onClick={this.saveChanges}>Save Changes</button>
      </div>
    )
  }

}

export default EditScriptItem
