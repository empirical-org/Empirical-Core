import React, {Component} from 'react'
import ScriptComponent from '../shared/scriptComponent'
import SlideHTMLEditor from './slideHTMLEditor'
import _ from 'lodash'
import * as CLIntF from '../../../interfaces/classroomLessons';

interface EditScriptItemProps {
  scriptItem: CLIntF.ScriptItem,
  save: Function,
  delete: Function
}

interface EditScriptItemState {
  scriptItem: CLIntF.ScriptItem,
}

class EditScriptItem extends Component<EditScriptItemProps, EditScriptItemState> {
  constructor(props){
    super(props);

    this.state = {
      scriptItem: this.props.scriptItem
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.deleteScriptItem = this.deleteScriptItem.bind(this)
  }
  
  // componentWillReceiveProps(nextProps) {
  //   if (!_.isEqual(this.state.scriptItem, nextProps.scriptItem)) {
  //     this.setState({scriptItem: nextProps.scriptItem})
  //   }
  // }
  //
  updateValue(e, value) {
    const newScriptItem = Object.assign({}, this.state.scriptItem)
    if (newScriptItem.data) {
      newScriptItem.data[value] = e.target.value
    }
    this.setState({scriptItem: newScriptItem})
  }

  updateBody(e) {
    const newScriptItem = Object.assign({}, this.state.scriptItem)
    if (newScriptItem.data) {
      newScriptItem.data.body = e
    }
    this.setState({scriptItem: newScriptItem})
  }

  saveChanges() {
    this.props.save(this.state.scriptItem)
  }

  deleteScriptItem() {
    this.props.delete()
  }

  renderForm() {
    const scriptItem = this.state.scriptItem
    const heading = scriptItem && scriptItem.data ? scriptItem.data.heading : ''
    const body = scriptItem && scriptItem.data ? scriptItem.data.body : ''
    switch (scriptItem.type) {
      case 'STEP-HTML-TIP':
      case 'STEP-HTML':
        return (
          <div className="admin-show-script-item">
            <div className="field">
              <label className="label">Heading</label>
              <div className="control">
                <input className="input" onChange={(e) => this.updateValue(e, 'heading')} placeholder="Heading" type="text" value={heading} />
              </div>
            </div>
            <div className="field">
              <label className="label">Body</label>
              <div className="control">
                <SlideHTMLEditor
                  handleTextChange={(e) => this.updateBody(e)}
                  text={body}
                />
              </div>
            </div>
            <button className='button is-primary' onClick={this.saveChanges} style={{marginRight: '15px'}}>Save Changes</button>
            <button className='button is-primary' onClick={this.deleteScriptItem}>Delete</button>
          </div>
        )
      case 'Overview':
        return (
          <div className="admin-show-script-item">
            <div className="field">
              <label className="label">Body</label>
              <div className="control">
                <SlideHTMLEditor
                  handleTextChange={(e) => this.updateBody(e)}
                  text={body}
                />
              </div>
            </div>
            <button className='button is-primary' onClick={this.saveChanges}>Save Changes</button>
          </div>
        )
    }
  }

  renderPreview() {
    if (this.props.scriptItem.type === 'Overview') {
      const scriptData = this.state.scriptItem.data
      if (scriptData) {
        const html:string =  scriptData.body || '';
        return <div className="lobby-text" dangerouslySetInnerHTML={{__html: html}}  />
      }
    } else {
      return <ScriptComponent script={[this.state.scriptItem]} />
    }
  }

  render() {
    return (
      <div>
        <div className="admin-script-item-preview">{this.renderPreview()}</div>
        {this.renderForm()}
      </div>
    )
  }

}

export default EditScriptItem
