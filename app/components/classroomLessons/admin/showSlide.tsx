import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  getComponent,
  getClassroomLesson,
  scriptItemTypeKeys
} from './helpers'
import {
  addScriptItem
} from '../../../actions/classroomLesson'
import * as IntF from '../interfaces';
import Script from './script'
import {
  saveClassroomLessonSlide,
  deleteClassroomLessonSlide
} from 'actions/classroomLesson'

class ShowClassroomLessonSlide extends Component<any, any> {
  constructor(props){
    super(props);

    this.save = this.save.bind(this)

    this.state = {
      newScriptItemType: 'STEP-HTML'
    }

    this.addScriptItem = this.addScriptItem.bind(this)
    this.selectNewScriptItemType = this.selectNewScriptItemType.bind(this)
    this.deleteSlide = this.deleteSlide.bind(this)
  }

  classroomLesson(): IntF.ClassroomLesson {
    return getClassroomLesson(this.props.classroomLessons.data, this.props.params.classroomLessonID)
  }

  currentSlide() {
    return this.classroomLesson().questions[this.props.params.slideID]
  }

  save(newValues) {
    const {classroomLessonID, slideID} = this.props.params;
    saveClassroomLessonSlide(classroomLessonID, slideID, newValues)
  }

  deleteSlide() {
    const {classroomLessonID, slideID} = this.props.params;
    const slides = this.classroomLesson().questions
    deleteClassroomLessonSlide(classroomLessonID, slideID, slides)
    window.location = `${window.location.origin}/#/admin/classroom-lessons/${classroomLessonID}/`
  }

  addScriptItem() {
    addScriptItem(this.props.params.classroomLessonID, this.props.params.slideID, this.currentSlide(), this.state.newScriptItemType)
  }

  selectNewScriptItemType(e) {
    this.setState({newScriptItemType: e.target.value})
  }

  renderAddScriptItem() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const options = scriptItemTypeKeys.map(key => <option key={key} value={key}>{key}</option>)
      return <div>
        <select value={this.state.newScriptItem} onChange={this.selectNewScriptItemType}>{options}</select>
        <button onClick={this.addScriptItem}>Add Script Item</button>
      </div>
    }
  }

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const Component = getComponent(this.currentSlide().type)
      const deleteButton = this.currentSlide().type === 'CL-LB' || this.currentSlide().type === 'CL-EX' ? <span /> : <button onClick={this.deleteSlide}>Delete Slide</button>
      return (
        <div>
          <h4 className="title is-4">
            {this.classroomLesson().title}
          </h4>
          <h5 className="title is-5">
            {this.currentSlide().data.teach.title}
          </h5>
          {deleteButton}
          <p>{getComponentDisplayName(this.currentSlide().type)}</p>
          <Component question={this.currentSlide().data} save={this.save}/>
          <Script
            script={this.currentSlide().data.teach.script}
            lesson={this.props.params.classroomLessonID}
            slide={this.props.params.slideID}
          />
          {this.renderAddScriptItem()}
        </div>
      )
    } else {
      return (<p>Loading...</p>)
    }

  }

}

function select(props) {
  return {
    classroomLessons: props.classroomLessons
  };
}

export default connect(select)(ShowClassroomLessonSlide)
