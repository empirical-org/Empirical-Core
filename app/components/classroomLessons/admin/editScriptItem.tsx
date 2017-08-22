import React, {Component} from 'react'
import ScriptComponent from '../shared/scriptComponent'
import MultipleTextEditor from '../shared/multipleTextEditor'

import * as IntF from '../interfaces';

class EditScriptItem extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {
      scriptItem: this.props.scriptItem;
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.deleteScriptItem = this.deleteScriptItem.bind(this)
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

  deleteScriptItem() {
    this.props.delete()
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
          <button onClick={this.saveChanges}>Save Changes</button>
          <button onClick={this.deleteScriptItem}>Delete</button>
        </div>)
    }
  }

  render() {
    return (
      <div>
        <ScriptComponent script={[this.state.scriptItem]} />
        {this.renderForm()}

      </div>
    )
  }

}

export default EditScriptItem
