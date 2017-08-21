import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getClassroomLessonScriptItem
} from './helpers';
import * as IntF from '../interfaces';

import ScriptComponent from '../shared/scriptComponent'

class showScriptItem extends Component<any, any> {
  constructor(props){
    super(props);
  }

  getCurrentScriptItem(): IntF.ScriptItem {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    return getClassroomLessonScriptItem(this.props.classroomLessons.data, classroomLessonID, slideID, scriptItemID)
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      return <ScriptComponent script={[this.getCurrentScriptItem()]}
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
