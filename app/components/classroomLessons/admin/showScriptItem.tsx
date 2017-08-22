import React, {Component} from 'react'
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getClassroomLessonScriptItem,
  getClassroomLessonSlide
} from './helpers';
import {
  saveClassroomLessonScriptItem,
  deleteScriptItem
} from 'actions/classroomLesson'

import * as IntF from '../interfaces';

import EditScriptItem from './editScriptItem';

class showScriptItem extends Component<any, any> {
  constructor(props){
    super(props);
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
  }

  getCurrentScriptItem(): IntF.ScriptItem {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    return getClassroomLessonScriptItem(this.props.classroomLessons.data, classroomLessonID, slideID, scriptItemID)
  }

  save(scriptItem: IntF.ScriptItem) {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    saveClassroomLessonScriptItem(classroomLessonID, slideID, scriptItemID, scriptItem)
  }

  delete() {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    const script = getClassroomLessonSlide(this.props.classroomLessons.data, classroomLessonID, slideID).data.teach.script;
    deleteScriptItem(classroomLessonID, slideID, scriptItemID, script)
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}/slide/${slideID}`
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      return (
        <EditScriptItem scriptItem={this.getCurrentScriptItem()} save={this.save} delete={this.delete}/>
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
