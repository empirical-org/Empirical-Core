import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getClassroomLessonScriptItem
} from './helpers';
import {
  saveClassroomLessonScriptItem
} from 'actions/classroomLesson'

import * as IntF from '../interfaces';

import EditScriptItem from './editScriptItem';

class showScriptItem extends Component<any, any> {
  constructor(props){
    super(props);
    this.save = this.save.bind(this)
  }

  getCurrentScriptItem(): IntF.ScriptItem {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    return getClassroomLessonScriptItem(this.props.classroomLessons.data, classroomLessonID, slideID, scriptItemID)
  }

  save(scriptItem: IntF.ScriptItem) {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    saveClassroomLessonScriptItem(classroomLessonID, slideID, scriptItemID, scriptItem)
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      return (
        <EditScriptItem scriptItem={this.getCurrentScriptItem()} save={this.save}/>
      )
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
