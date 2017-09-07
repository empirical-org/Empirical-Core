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
import * as CLIntF from '../../../interfaces/ClassroomLessons';

import EditScriptItem from './editScriptItem';

class showScriptItem extends Component<any, any> {
  constructor(props){
    super(props);
    this.save = this.save.bind(this)
    this.saveAlert = this.saveAlert.bind(this)
    this.delete = this.delete.bind(this)
  }

  classroomLesson(): IntF.ClassroomLesson {
    return this.props.classroomLessons.data[this.props.params.classroomLessonID]
  }

  currentSlide(): IntF.Question {
    return this.classroomLesson().questions[this.props.params.slideID]
  }

  getCurrentScriptItem(): CLIntF.ScriptItem {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    return getClassroomLessonScriptItem(this.props.classroomLessons.data, classroomLessonID, slideID, scriptItemID)
  }

  save(scriptItem: CLIntF.ScriptItem) {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    saveClassroomLessonScriptItem(classroomLessonID, slideID, scriptItemID, scriptItem, this.saveAlert)
  }

  saveAlert() {
    alert('Saved!')
  }

  delete() {
    const {classroomLessonID, slideID, scriptItemID} = this.props.params;
    const script = getClassroomLessonSlide(this.props.classroomLessons.data, classroomLessonID, slideID).data.teach.script;
    deleteScriptItem(classroomLessonID, slideID, scriptItemID, script)
    window.location.href = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}/slide/${slideID}`
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const {classroomLessonID, slideID, scriptItemID} = this.props.params;
      const lessonLink = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}`
      const slideLink = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}/slide/${slideID}`
      return (
        <div className="admin-classroom-lessons-container">
          <h4 className="title is-4">Lesson: <a href={lessonLink}>{this.classroomLesson().title}</a></h4>
          <h5 className="title is-5">Slide: <a href={slideLink}>{this.currentSlide().data.teach.title}</a></h5>
          <h5 className="title is-5">Script Item #{Number(scriptItemID) + 1}</h5>
          <EditScriptItem scriptItem={this.getCurrentScriptItem()} save={this.save} delete={this.delete}/>
        </div>
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
