import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getClassroomLessonScriptItem
} from './helpers';
import * as IntF from '../interfaces';

import ScriptComponent from '../shared/scriptComponent'

class showScriptItem extends Component<any, any> {
  constructor(props){
    super(props);

    this.state = {}
  }

  componentDidUpdate() {
    if (this.props.classroomLessons.hasreceiveddata && !this.state.scriptItem) {
      this.setState({scriptItem: this.getCurrentScriptItem()})
    }
  }

  getCurrentScriptItem(): IntF.ScriptItem {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    return getClassroomLessonScriptItem(this.props.classroomLessons.data, classroomLessonID, slideID, scriptItemID)
  }

  updateValue(e, value) {
    const newScriptItem = _.merge({}, this.state.scriptItem)
    newScriptItem.data[value] = e.target.value
    this.setState({scriptItem: newScriptItem})
  }

  // updateBody(e) {
  //   const newScriptItem = _.merge({}, this.state.scriptItem)
  //   newScriptItem.data.body = e.target.value
  //   this.setState({scriptItem: newScriptItem})
  // }
  //
  renderForm() {
    switch (this.state.scriptItem.type) {
      case 'STEP-HTML':
        return (<div>
          <textarea onChange={(e) => this.updateValue(e, 'heading')} value={this.state.scriptItem.data.heading}></textarea>
          <textarea onChange={this.updateBody} value={this.state.scriptItem.data.body}></textarea>
        </div>)
    }
  }

  render() {
    if (this.state.scriptItem) {
      return (
        <div>
          <ScriptComponent script={[this.state.scriptItem]} />
          {this.renderForm()}
        </div>
      )
      // return (
      //   <div>
      //     {this.getCurrentScriptItem().data.heading}
      //   </div>
      // )
    } else {
      return (
        <p>Loading...</p>
      )
    }

  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(showScriptItem)
