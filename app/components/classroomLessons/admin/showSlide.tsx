import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
  getComponentDisplayName,
  getComponent,
  getClassroomLesson
} from './helpers'
import * as IntF from '../interfaces';
import Script from './script'
import {
  saveClassroomLessonSlide
} from 'actions/classroomLesson'

class ShowClassroomLessonSlide extends Component<any, any> {
  constructor(props){
    super(props);

    this.save = this.save.bind(this)
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

  render() {
    if (this.props.classroomLessons.hasreceiveddata) {
      const Component = getComponent(this.currentSlide().type)
      return (
        <div>
          <h4 className="title is-4">
            {this.classroomLesson().title}
          </h4>
          <h5 className="title is-5">
            {this.currentSlide().data.teach.title}
          </h5>
          <p>{getComponentDisplayName(this.currentSlide().type)}</p>
          <Component question={this.currentSlide().data} save={this.save}/>
          <Script
            script={this.currentSlide().data.teach.script}
            lesson={this.props.params.classroomLessonID}
            slide={this.props.params.slideID}
          />
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
